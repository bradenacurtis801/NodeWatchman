function getNicInfoString() {
    return `
        ip addr | awk '
            /^[0-9]+:/ {
                if (iface != "" && mac != "") print iface ": " mac;
                iface = $2; sub(/:$/, "", iface); mac = "";
            }
            $1 == "link/ether" { mac = $2; }
            END {
                if (iface != "" && mac != "") print iface ": " mac;
            }
        '`;
}

function getGPUInfoString() {
    return 'nvidia-smi -L';
}

function gpuStatus() {
   return `# Check the nvidia-smi command locally
    nvidia-smi > /dev/null 2>&1

    if [ $? -eq 0 ]; then
        echo "result-color: green"
    else    
        echo "result-color: red"
    fi`
}