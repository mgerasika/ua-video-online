import { parseRezkaAllPagesAsync } from './rezka-all.controller';
import { parseRezkaDetailsAsync } from './rezka-details.controller';
import { getCypressImdbAsync } from '../parser/cypress-imdb.controller';
import { getCypressRezkaStreamsAsync } from './cypress-rezka-streams.controller';


export const parser = {
    parseRezkaDetailsAsync,
    parseRezkaAllPagesAsync,
    getCypressImdbAsync,
    getCypressRezkaStreamsAsync,
};
