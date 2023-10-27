import { createUrls, EMPTY_URL_ITEM, IUrlItem } from 'react-create-url';

interface IApiUrl {
    swagger: IUrlItem;
    api: {
        imdb: {
            id: (id?: string) => IUrlItem;
            search: IUrlItem;
            search_ua_name: IUrlItem;
        };
        rabbitMQ: {
            sendMessage: IUrlItem;
        };
        groupMovie: {
            id: (id?: string) => IUrlItem;
        };
        actor: {
            id: (id?: string) => IUrlItem;
        };
        rezkaMovie: {
            search: IUrlItem;

            id: (id?: string) => IUrlItem;
        };
        rezkaMovieTranslation: IUrlItem;
        stream: {
            id: (id?: string) => IUrlItem;
        };
        cdn: {
            id: (id?: string) => {
                hasFile: IUrlItem;
            };
            upload: IUrlItem;
        };
        translation: {
            id: (id?: string) => IUrlItem;
        };
        tools: {
            setup: IUrlItem;
            image_search: IUrlItem;
        };

        parser: {
            rezkaAll: IUrlItem;
            rezkaDetails: IUrlItem;
            cypressStreams: IUrlItem;
            cypressImdb: IUrlItem;
        };
    };
}

export const API_URL = createUrls<IApiUrl>({
    swagger: EMPTY_URL_ITEM,
    api: {
        imdb: {
            id: (id?: string) => EMPTY_URL_ITEM,
            search: EMPTY_URL_ITEM,
            search_ua_name: EMPTY_URL_ITEM,
        },
        rabbitMQ: {
            sendMessage: EMPTY_URL_ITEM,
        },
        rezkaMovie: {
            search: EMPTY_URL_ITEM,
            id: (id?: string) => EMPTY_URL_ITEM,
        },
        rezkaMovieTranslation: EMPTY_URL_ITEM,
        stream: {
            id: (id?: string) => EMPTY_URL_ITEM,
        },
        cdn: {
            id: (id?: string) => ({
                hasFile: EMPTY_URL_ITEM,
            }),
            upload: EMPTY_URL_ITEM,
        },
        translation: {
            id: (id?: string) => EMPTY_URL_ITEM,
        },
        groupMovie: {
            id: (id?: string) => EMPTY_URL_ITEM,
        },

        actor: {
            id: (id?: string) => EMPTY_URL_ITEM,
        },
        tools: {
            setup: EMPTY_URL_ITEM,
            image_search: EMPTY_URL_ITEM,
        },
        parser: {
            rezkaAll: EMPTY_URL_ITEM,
            rezkaDetails: EMPTY_URL_ITEM,
            cypressStreams: EMPTY_URL_ITEM,
            cypressImdb: EMPTY_URL_ITEM,
        },
    },
});
