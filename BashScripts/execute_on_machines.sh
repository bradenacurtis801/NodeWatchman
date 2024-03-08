parse_output_to_json() {
    local ip="$1"
    local command="$2"
    local output="$3"

    # Replace newlines with '\n'
    output=$(echo "$output" | sed ':a;N;$!ba;s/\n/\\n/g')

    # Check if output contains error message
    if [[ $output == *"No route to host"* ]]; then
        # Create JSON object for error
        echo "{\"ip\": \"$ip\", \"error\": \"No route to host\"}"
    else
        # Extract filenames from output
        filenames=$(echo "$output" | grep -oP '\S+\.(sh|txt|Dockerfile)')
        # Create JSON object for command output
        echo "{\"ip\": \"$ip\", \"result\": {\"cmd\": \"$command\", \"output\": \"$filenames\"}}"
    fi
}

# Declare an array to store JSON data
declare -a json_data

# Check if at least two arguments are provided
if [ "$#" -lt 2 ]; then
    echo "Usage: $0 'machine1_ip,machine2_ip,...' 'command to execute'"
    exit 1
fi

# Split the first argument into an array of IPs
IFS=',' read -r -a machine_ips <<< "$1"

# The command to execute on each machine
command="$2"

# Loop through the array of IPs and execute the command on each machine in parallel
for ip in "${machine_ips[@]}"; do
    (
        printf "Executing on %s:\n%s\n" "$ip" "$(printf '%.0s-' {1..10})"
        # Capture the output of each SSH command and write it to a temporary file
        output=$(ssh -i ../id_rsa -o StrictHostKeyChecking=no testuser@"$ip" "$command" 2>&1)
        # If using a key for SSH, use: output=$(ssh -i /path/to/private/key user@"$ip" "$command" 2>&1)

        # Output to console
        printf "%s\n" "$output"

        # Call function to parse output and create JSON object
        parse_output_to_json "$ip" "$command" "$output"
    ) &
done

wait

echo "done"
