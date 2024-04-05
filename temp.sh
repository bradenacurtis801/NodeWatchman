# Update trusted CA certificates
sudo update-ca-certificates


# restart the k3s node
# If the node is a worker node, use the following command:
sudo systemctl restart k3s-agent
# If the node is a master node, use the command below instead:
sudo systemctl restart k3s.service 




# check if service restarted without issue
sudo systemctl status k3s-agent
sudo systemctl status k3s.service