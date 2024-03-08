#!/bin/bash

# Function to create a rack of 20 Docker containers with specified IP addresses
create_rack() {
    local rackNumber=$1
    echo "Creating rack with rack number: $rackNumber"
    for ((i=1; i<=20; i++)); do
    (    local ip="10.10.$rackNumber.$i"
        echo "Creating container with IP: $ip"
        docker run -d --rm --name "machine${rackNumber}_$i" \
            --network test-network-10.10/16 --ip $ip my_ssh_server
    ) &
    done
    echo "Rack $rackNumber creation completed."
}

# Function to loop through rack numbers and create racks
create_racks_from_list() {
    local rackNumbers='
    11
    12
    13
    14
    21
    22
    23
    24
    25
    111
    112
    113
    121
    122
    123
    124
    125
    '

    for rackNumber in $rackNumbers; do
        if [[ ! -z "$rackNumber" ]]; then # Check if the rack number is not empty
            (
                create_rack $rackNumber
            ) &
        fi
    done
}

# Function to dispose of all containers created by the create_rack function
dispose_racks() {
    echo "Disposing of all rack containers..."
    local pids=()

    local containers=$(docker ps -a --filter "name=machine" --format "{{.Names}}")
    for container in $containers; do
        echo "Stopping and removing container: $container"
        docker stop $container && docker rm $container &
        pids+=($!)
    done

    # Wait for all background processes to complete
    for pid in "${pids[@]}"; do
        wait $pid
    done

    echo "All rack containers have been disposed of."
}

# Call the function to create racks from the list
# create_racks_from_list
# Uncomment the line below to test the dispose_racks function
dispose_racks



# get all ips
# docker ps --format '{{.ID}}\t{{.Names}}' | while read -r container_id container_name; do
#     ip=$(docker inspect --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' "$container_id")
#     echo -e "$container_id\t$container_name\t$ip"
# done
