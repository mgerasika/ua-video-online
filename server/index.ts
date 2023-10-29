require('module-alias/register');
import { rabbitMQ_connectQueueAsync } from '@server/rabbit-mq';
import { dbService } from './src/controller/db.service';
import { app } from './src/express-app';
import { typeOrmAsync } from './src/utils/type-orm-async.util';
import { ENV } from '@server/env';

app.get('/', (req, res) => {
    res.send(JSON.stringify(dbService, null, 2));
});

if (process.env.NODE_ENV === 'development') {
    // sync database
    typeOrmAsync(() => Promise.resolve(['']));
}

const port = process.env.PORT || 8005;
if (ENV.rabbit_mq) {
    rabbitMQ_connectQueueAsync((data) => {
        if (data.setupBody) {
            return dbService.tools.setupAsync(data.setupBody);
        }
        return Promise.resolve('empty');
    });
}
// console.log('ENV = ', ENV);
const server = app.listen(port, function () {
    console.log('Listening on port ' + port);
});
