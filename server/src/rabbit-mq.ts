import amqp, { Channel, Connection, ConsumeMessage } from 'amqplib';

let _connection: Connection;
let _channel: Channel;
const CHANNEL_NAME = 'ua-video-online-queue';
export async function rabbitMQ_connectQueueAsync() {
    try {
        _connection = await amqp.connect('amqp://178.210.131.101:5672');
        if (_connection) {
            _channel = await _connection.createChannel();

            await _channel.assertQueue(CHANNEL_NAME);

            _channel.consume(CHANNEL_NAME, (data: ConsumeMessage | null) => {
                // console.log(data)
                if (data) {
                    console.log('Rabbit MQ Data received :', `${Buffer.from(data.content)}`);
                    _channel.ack(data);
                }
            });
        }
    } catch (error) {
        console.log(error);
    }
}

export const rabbitMQ_sendData = async (data: any) => {
    if (_channel) {
        await _channel.sendToQueue(CHANNEL_NAME, Buffer.from(JSON.stringify(data)));
    } else {
        console.log('channel is null');
    }
};
