#!/bin/bash

# Declare an array to store JSON data
temp_file=$(mktemp)

# Check if at least one argument is provided (since we don't need IPs)
if [ "$#" -lt 1 ]; then
    echo "Usage: $0 'command to execute'" | tee -a debug.txt
    exit 1
fi

# The command to execute
command="$1"

# Simulate the execution of the command as if it's being run on multiple "fake" IPs
fake_ips=("192.168.1.100" "192.168.1.101" "192.168.1.102")

# Loop through the array of fake IPs and execute the command locally
for ip in "${fake_ips[@]}"; do
    (
        # Simulate capturing the output of the command
        if output=$($command 2>&1); then
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
                '{"ip": $_ip, "result": {"cmd": $_cmd, "output": $_out}, "color": $_color}'
        else
            jq -nR \
                --arg _ip "$ip" \
                --arg _err "Command failed to execute" \
                --arg _err_info "$output" \
                '{"ip": $_ip, "error": $_err, "error_info": $_err_info, "color": "red"}'
        fi
    ) &
done

wait

# Combine individual JSON objects into a JSON array
jq -s '.' < "$temp_file"

rm "$temp_file" # Clean up the temporary file
