import axios from 'axios';
import { API_URL } from '@server/constants/api-url.constant';
import { IExpressResponse, app } from '@server/express-app';
import { cdnService } from './cdn.service';
import { error } from 'console';
import { ENV } from '@server/env';
import { IQueryReturn, toQuery, toQueryPromise } from '@server/utils/to-query.util';
const fs = require('fs');

interface IRequest {
    body: {
        fileUrl: string;
        fileName: string;
    };
}

interface IResponse extends IExpressResponse<void, void> {}

app.post(API_URL.api.cdn.upload.toString(), async (req: IRequest, res: IResponse) => {
    if (!req.body.fileUrl) {
        return res.status(400).send('fileUrl is undefined');
    }
    const [data, error] = await uploadFileToCDNAsync({ fileUrl: req.body.fileUrl, fileName: req.body.fileName });
    if (error) {
        return res.status(400).send(error);
    }
    return res.send(data);
});

export const uploadFileToCDNAsync = async ({
    fileUrl,
    fileName,
}: {
    fileUrl: string;
    fileName: string;
}): Promise<IQueryReturn<string>> => {
    const [response, downloadError] = await toQuery(() =>
        axios.get(fileUrl, {
            responseType: 'arraybuffer',
            responseEncoding: 'utf-8',
        }),
    );
    if (downloadError) {
        return [, 'downloadError' + downloadError];
    }

    console.log('download', response?.data);
    const fileContent = response?.data as string;

    return toQueryPromise((resolve, reject) => {
        fs.writeFile(cdnService.cdnFile(fileName), fileContent, (err: unknown) => {
            if (err) {
                return reject(('write to file error' + err) as unknown as string);
            }
            return resolve(ENV.cdn + fileUrl);
        });
    });
};
