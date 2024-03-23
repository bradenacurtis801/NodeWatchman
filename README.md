entry point:
run the following bash command:
pm2 start processes.json

pm2 useful commands:
'pm2 logs backend' # View logs for the backend application
'pm2 logs 1' # View logs for the application with id 1 (frontend in your case)
'pm2 monit' # For real-time monitoring of your applications, including CPU and memory usage
'pm2 plus' # PM2 Dashboard
'pm2 stop <application>'
'pm2 stop all'
'pm2 restart <application>'
'pm2 restart all'
'pm2 delete <app>'
'pm2 delete all'
