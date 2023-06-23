import 'module-alias/register';
const functions = require('firebase-functions');
import * as admin from 'firebase-admin';
import { dbService } from '../../src/controller/db.service';
import { app as expressApp } from '../../src/express-app';
import { rabbitMQ_connectQueueAsync } from '../../src/rabbit-mq';
import { API_URL } from '@server/constants/api-url.constant';

admin.initializeApp();
expressApp.get('/echo', (req, res) => {
    functions.logger.log('/echo api call ');
    res.send(JSON.stringify(dbService, null, 2));
});
rabbitMQ_connectQueueAsync((data) => {
    console.log(data);
    return Promise.resolve('');
});

// Define your Express routes here
export const app = functions.https.onRequest(expressApp);
