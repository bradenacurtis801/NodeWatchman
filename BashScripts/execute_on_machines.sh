#!/bin/bash
ls
# # Check if at least two arguments are provided
# if [ "$#" -lt 2 ]; then
#     echo "Usage: $0 'machine1_ip,machine2_ip,...' 'command to execute'"
#     exit 1
# fi

# # Split the first argument into an array of IPs
# IFS=',' read -r -a machine_ips <<< "$1"

# # The command to execute on each machine
# command="$2"

# # Loop through the array of IPs and execute the command on each machine
# for ip in "${machine_ips[@]}"; do
#     echo "Executing on $ip:"
#     ssh user@"$ip" "$command"
#     # If using a key for SSH, use: ssh -i /path/to/private/key user@"$ip" "$command"
# done
