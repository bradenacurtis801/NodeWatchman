curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
        "boxStates": {
            "A1-11-1": {
                "ip": "10.10.11.1",
                "error": "No route to host"
            },
            "A1-11-2": {
                "ip": "10.10.11.2",
                "error": "No route to host"
            },
            "B2-125-19": {
                "ip": "10.10.125.19",
                "error": "No route to host"
            },
            "B2-125-20": {
                "ip": "10.10.125.20",
                "result": {
                    "cmd": "\n      ip addr | awk '\n          $1 ~ /^[0-9]+:/ { \n              if (iface != \"\" && mac != \"\") print iface\": \"mac\n              iface = $2; sub(/:$/, \"\", iface); mac = \"\" \n          }\n          $1 == \"link/ether\" { mac = $2 }\n          END {\n              if (iface != \"\" && mac != \"\") print iface\": \"mac\n          }\n      '",
                    "output": "eno2: 80:e8:2c:e2:ea:fb\neno1: 80:e8:2c:e2:ea:fb\nbond0: 80:e8:2c:e2:ea:fb\ndocker0: 02:42:aa:92:d1:d1"
                }
            }
        }
    }' \
  http://localhost:3001/interact/update-machine-state

