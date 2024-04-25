#!/bin/bash

# Declare an array to store JSON data
temp_file=$(mktemp)

# Check if at least two arguments are provided
if [ "$#" -lt 2 ]; then
    echo "Usage: $0 'machine1_ip,machine2_ip,...' 'command to execute'" | tee -a debug.txt
    exit 1
fi

# Split the first argument into an array of IPs
IFS=',' read -r -a machine_ips <<< "$1"

# The command to execute on each machine
command="$2"

# Loop through the array of IPs and execute the command on each machine in parallel
for ip in "${machine_ips[@]}"; do
    (
        # Capture the output of each SSH command and write it to a temporary file
        if output=$(ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 ubuntu@"$ip" "$command" 2>/dev/null); then
             # Look for a special label in the output to determine the color
            color=$(echo "$output" | grep -oP 'result-color: \K\w+')
            
            # Default color if not specified
            [[ -z "$color" ]] && color="red"

            # Remove the label line from the output to clean up before JSON formatting
            output=$(echo "$output" | sed '/result-color:/d')

            jq -nR \
                --arg _ip "$ip" \
                --arg _cmd "$command" \
                --arg _out "$output" \
                --arg _color "$color" \
                '{"ip": $_ip, "result": {"cmd": $_cmd, "output": $_out}, "color": $_color}' \
                >> "$temp_file"
        else
            # If SSH connection fails, write an error message to the temporary file
            jq -nR \
                --arg _ip "$ip" \
                --arg _err "SSH connection failed" \
                --arg _err_info "$output" \
                '{"ip": $_ip, "error": $_err, "error_info": $_err_info}' \
                >> "$temp_file"
        fi
    ) &
done

wait

# Combine individual JSON objects into a JSON array
jq -s '.' < "$temp_file"

rm "$temp_file" # Clean up the temporary file

