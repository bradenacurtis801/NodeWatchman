NAME=$(kubectl get pods -n gpu-operator -l "app=nvidia-dcgm-exporter" -o "jsonpath={.items[0].metadata.name}")

kubectl logs $NAME -n gpu-operator