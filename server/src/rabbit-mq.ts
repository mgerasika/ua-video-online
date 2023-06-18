import amqp, { Channel, Connection, ConsumeMessage } from 'amqplib';
import { IQueryReturn } from './utils/to-query.util';

let _connection: Connection;
let _channel: Channel;
const CHANNEL_NAME = 'ua-video-online-queue';
export async function rabbitMQ_connectQueueAsync() {
    try {
        _connection = await amqp.connect('amqp://178.210.131.101:5672');
        if (_connection) {
            console.log('Connected to Rabbit MQ');
            _channel = await _connection.createChannel();

            await _channel.assertQueue(CHANNEL_NAME, {});

            _channel.prefetch(1);
            _channel.consume(
                CHANNEL_NAME,
                (data: ConsumeMessage | null) => {
                    if (data) {
                        console.log('Rabbit MQ Data received :', `${Buffer.from(data.content)}`);
                        setTimeout(() => {
                            _channel.ack(data);
                        }, 100);
                    }
                },
                { noAck: false },
            );
        }
    } catch (error) {
        console.log('known error', error);

        setTimeout(rabbitMQ_connectQueueAsync, 30 * 1000);
    }
}

export const rabbitMQ_sendData = async (data: any): Promise<IQueryReturn<boolean>> => {
    if (_channel) {
        await _channel.sendToQueue(CHANNEL_NAME, Buffer.from(JSON.stringify(data)));
        return [true];
    } else {
        console.log('channel is null');
        return [, 'channel is null'];
    }
};
