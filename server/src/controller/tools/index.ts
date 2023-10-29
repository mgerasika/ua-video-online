import { imageSearchAsync } from './image_search.controller';
import { setupRabbitMqAsync } from './setup-rabbit-mq.controller';
import { setupAsync } from './setup.controller';

export const tools = {
	setupAsync,
	setupRabbitMqAsync,
	imageSearchAsync
};
