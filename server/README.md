# nodejs-server

works on 16.17.0 (16.14.0 have problems https://www.google.com/search?q=checkFunctionsSDKVersion+was+unable+to+fetch+information+from+NPM+Error%3A+spawnSync+npm+ETIMEDOUT&oq=checkFunctionsSDKVersion+was+unable+to+fetch+information+from+NPM+Error%3A+spawnSync+npm+ETIMEDOUT&aqs=chrome..69i57j69i59.1180j0j7&sourceid=chrome&ie=UTF-8)
docker tag ua-video-online-server mgerasika/ua-video-online-server:v2
docker push mgerasika/ua-video-online-server:v2

docker pull mgerasika/ua-video-online-server:v2
docker run --network=host --restart=always --env PORT=8008 -v /home:/home -d -p $port:8008 --env-file=.env --name ua-video-online mgerasika/ua-video-online-server:v2
docker run --network=host --restart=always --env PORT=8008 -v /home:/home -d -p $port:8008 --name ua-video-online mgerasika/ua-video-online-server:v2
