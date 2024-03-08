#!/bin/bash

# Improved function to parse output and create JSON object using jq
parse_output_to_json() {
    local ip="$1"
    local command="$2"
    local output="$3"

    # Check if output contains error message
    if [[ $output == *"No route to host"* ]]; then
        # Create JSON object for error using jq
        jq -n --arg ip "$ip" '{"ip": $ip, "error": "No route to host"}'
    else
        # Use jq to properly escape and create JSON objects
        jq -nR --arg ip "$ip" --arg cmd "$command" --arg out "$output" \
          '{"ip": $ip, "result": {"cmd": $cmd, "output": $out}}'
    fi
}

# Declare an array to store JSON data
declare -a json_data

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
        # Output execution info to both console and debug.txt
        printf "Executing on %s:\n%s\n" "$ip" "$(printf '%.0s-' {1..10})" | tee -a debug.txt

        # Capture the output of each SSH command and write it to a temporary file
        output=$(ssh -o StrictHostKeyChecking=no ubuntu@"$ip" "$command" 2>&1 | tee -a debug.txt)

        # Call function to parse output and create JSON object
        json=$(parse_output_to_json "$ip" "$command" "$output")
        echo "$json" | tee -a debug.txt
    ) &
done

wait

echo "done" | tee -a debug.txt

