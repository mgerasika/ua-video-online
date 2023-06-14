import { getActorListAllAsync } from './get-actor-list.controller';
import { getActorDetailsAsync } from './get-actor-details.controller';
import { postActorAsync } from './post-actor.controller';
import { putActorAsync } from './put-actor.controller';
import { deleteActorAsync } from './delete-actor.controller';

export const actor = {
     getActorListAllAsync,
     getActorDetailsAsync,
     postActorAsync,
     putActorAsync,
     deleteActorAsync,
};
