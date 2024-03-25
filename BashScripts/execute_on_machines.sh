#!/bin/bash
#sudo apt install jq
# Improved function to parse output and create JSON object using jq
parse_output_to_json() {
    local ip="$1"
    local command="$2"
    local output="$3"

    # Check if output contains "No route to host" error message
    if [[ $output == *"No route to host"* ]]; then
        # Create JSON object for "No route to host" error using jq
        jq -n --arg ip "$ip" '{"ip": $ip, "error": "No route to host"}'
    elif [[ $output == *"Connection timed out"* ]]; then
        # Create JSON object for "Connection timed out" error using jq
        jq -n --arg ip "$ip" '{"ip": $ip, "error": "Connection timed out"}'
    else
        # Use jq to properly escape and create JSON objects for other outputs
        jq -nR --arg ip "$ip" --arg cmd "$command" --arg out "$output" \
          '{"ip": $ip, "result": {"cmd": $cmd, "output": $out}}'
    fi
}

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
        output=$(ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 ubuntu@"$ip" "$command" 2>&1)

        # Call function to parse output and create JSON object
        parse_output_to_json "$ip" "$command" "$output" >> "$temp_file"
    ) &
done

wait

# Combine individual JSON objects into a JSON array
jq -s '.' < "$temp_file"

rm "$temp_file" # Clean up the temporary file

