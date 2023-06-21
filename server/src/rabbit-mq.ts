import amqp, { Channel, Connection, ConsumeMessage } from 'amqplib';
import { IQueryReturn } from './utils/to-query.util';
import { ENV } from './env';

let _connection: Connection;
let _channel: Channel;
const CHANNEL_NAME = 'ua-video-online-queue';
export async function rabbitMQ_connectQueueAsync(callback: (data: any) => Promise<any>) {
    try {
        _connection = await amqp.connect(ENV.rabbit_mq || '');
        if (_connection) {
            console.log('Connected to Rabbit MQ');
            _channel = await _connection.createChannel();

            await _channel.assertQueue(CHANNEL_NAME, {});

            _channel.prefetch(1);
            _channel.consume(
                CHANNEL_NAME,
                (data: ConsumeMessage | null) => {
                    if (data) {
                        const body = Buffer.from(data.content);
                        console.log('Rabbit MQ Data received :', `${body}`);
                        let obj;
                        try {
                            obj = JSON.parse(body.toString());
                        } catch (ex) {
                            console.log('error parse rabbit mq message', ex);
                        }
                        if (obj) {
                            callback(obj)
                                .then((res) => {
                                    console.log('then', res);
                                    _channel.ack(data);
                                })
                                .catch(() => {
                                    _channel.ack(data);
                                });
                        } else {
                            _channel.ack(data);
                        }
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
