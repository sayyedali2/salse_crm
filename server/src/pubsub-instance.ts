import { PubSub } from 'graphql-subscriptions';

export const globalPubSub = new PubSub();
console.log('--- GLOBAL PUBSUB INSTANCE CREATED ---');
