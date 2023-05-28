import { getTranslationAllAsync } from './get-translation-list.controller';
import { getTranslationByIdAsync } from './get-translation.controller';
import { postTranslationAsync } from './post-translation.controller';
import { putTranslationAsync } from './put-translation.controller';
import { deleteTranslationAsync } from './delete-translation.controller';

export const translation = {
    getTranslationAllAsync,
    getTranslationByIdAsync,
    postTranslationAsync,
    putTranslationAsync,
    deleteTranslationAsync,
};
