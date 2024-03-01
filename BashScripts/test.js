#!/bin/bash

# Define the command to be executed
cmd='ls'

# Generate a list of IP addresses from 10.10.12.1 to 10.10.12.20
ips=$(seq -f "10.10.12.%g" 1 20)

# Call the execute_on_machines.sh script with the command and IP addresses
./execute_on_machines.sh "$cmd" "$ips"

