# nodejs-server

works on 16.17.0 (16.14.0 have problems https://www.google.com/search?q=checkFunctionsSDKVersion+was+unable+to+fetch+information+from+NPM+Error%3A+spawnSync+npm+ETIMEDOUT&oq=checkFunctionsSDKVersion+was+unable+to+fetch+information+from+NPM+Error%3A+spawnSync+npm+ETIMEDOUT&aqs=chrome..69i57j69i59.1180j0j7&sourceid=chrome&ie=UTF-8)

For deploy new image:
sh build.sh
sudo docker tag ua-video-online-server mgerasika/ua-video-online-server:v5
sudo docker login
sudo docker push mgerasika/ua-video-online-server:v5

docker pull mgerasika/ua-video-online-server:v2
docker run --network=host --restart=always --env PORT=8008 -v /home:/home -d -p $port:8008 --env-file=.env --name ua-video-online mgerasika/ua-video-online-server:v3
docker run --network=host --restart=always --env PORT=8008 -v /home:/home -d -p $port:8008 --env-file=/home/nuc8/git/ua-video-online/server/.env --name ua-video-online mgerasika/ua-video-online-server:v4

docker run --network=host --restart=always --env PORT=8008 -v /home:/home -d -p $port:8008
 --env DB_USER=ua_video_torrent_qcs3cqejcudbcetyvucdva2xntseearvtgl62ezpjzfhqm
 --env DB_PASSWORD=eJuYRxTNLU6wAQC3jnLvT7WSuq2VfgQDr9rFW5Q5WaLS9BgcE55SF6H7ygG7j9yYRPzB6jPab89etX3X
 --env DB_OWNER_USER=postgres
 --env DB_OWNER_PASSWORD=Zxc123=-
 --env DB_HOST=192.168.0.15
 --env CDN=https://ua-video-online-cdn.web.app/
 --env RABBIT_MQ=amqp://test:test@178.210.131.101:5672 
 --name ua-video-online mgerasika/ua-video-online-server:v4
