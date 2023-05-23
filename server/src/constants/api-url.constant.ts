import { createUrls, EMPTY_URL_ITEM, IUrlItem } from 'react-create-url';

interface IApiUrl {
    swagger: IUrlItem;
    api: {
        imdb: {
            id: (id?: string) => IUrlItem;
            search: IUrlItem;
        };
        groupMovie: {
            id: (id?: string) => IUrlItem;
        };
        rezkaMovie: {
            searchRezkaWithoutStream: IUrlItem;

            id: (id?: string) => IUrlItem;
        };
        stream: {
            id: (id?: string) => IUrlItem;
        };
        tools: {
            setup: IUrlItem;
        };
        cypress: {
            streams: IUrlItem;
            imdb: IUrlItem;
        };
        parser: {
            rezkaAll: IUrlItem;
            rezkaDetails: IUrlItem;
        };
    };
}

export const API_URL = createUrls<IApiUrl>({
    swagger: EMPTY_URL_ITEM,
    api: {
        cypress: {
            streams: EMPTY_URL_ITEM,
            imdb: EMPTY_URL_ITEM,
        },
        imdb: {
            id: (id?: string) => EMPTY_URL_ITEM,
            search: EMPTY_URL_ITEM,
        },

        rezkaMovie: {
            searchRezkaWithoutStream: EMPTY_URL_ITEM,
            id: (id?: string) => EMPTY_URL_ITEM,
        },
        stream: {
            id: (id?: string) => EMPTY_URL_ITEM,
        },
        groupMovie: {
            id: (id?: string) => EMPTY_URL_ITEM,
        },
        tools: {
            setup: EMPTY_URL_ITEM,
        },
        parser: {
            rezkaAll: EMPTY_URL_ITEM,
            rezkaDetails: EMPTY_URL_ITEM,
        },
    },
});
