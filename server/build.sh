#for local testing/or local docker container
image=ua-video-online-server
container=ua-video-online-server
port=8007

docker stop $container
docker rm $container
docker image rm $image
docker build -t $image -f Dockerfile . --build-arg PORT=$port
docker run --network=host --restart=always --env PORT=8007 -v /home:/home -d -p $port:8007 --env-file=.env --name $container $image