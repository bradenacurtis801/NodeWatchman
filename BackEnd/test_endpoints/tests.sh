
#Bash script for testing /register api
// curl -X POST http://localhost:3001/register -H "Content-Type: application/json" -d '{"username": "newuser", "password": "newpassword"}' 

 
curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d '{"loginIdentifier": "bradenacurtis801", "password": "wpkf0224"}'

curl -X POST http://localhost:3000/update-machine-state -H "Content-Type: application/json" -d "{\"executeResult\": $(cat interactive_nodes_updated.json)}"

############ Powershell ############

# Powershell script for testing /update-machine-state api

$headers = @{
    "Content-Type" = "application/json"
}

$body = @{
    executeResult = Get-Content -Raw -Path "interactive_nodes_updated.json"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/update-machine-state" -Method Post -Headers $headers -Body $body

# Powershell script for testing /register api
Invoke-WebRequest -Uri http://localhost:3001/register -Method POST -ContentType "application/json" -Body '{"username": "newuser", "password": "newpassword"}'

#Powershell script for testing /login api
Invoke-WebRequest -Uri http://localhost:3000/login -Method Post -ContentType "application/json" -Body '{"loginIdentifier": "bradenacurtis801", "wpkf0224": "wpkf0224"}'