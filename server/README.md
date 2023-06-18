# nodejs-server
docker tag ua-video-online-server-v1 mgerasika/ua-video-online-server:v1
docker push mgerasika/ua-video-online-server:v1

docker run --network=host --restart=always --env PORT=8008 -v /home:/home -d -p $port:8008 --env-file=.env --name ua-video-online mgerasika/ua-video-online-server:v1