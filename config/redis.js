const redis = require("redis")

const redisclient = redis.createClient({
    username: 'default',
    password: 'RfLuoscAAX5aFpzI9ZPyCNL1rwMvBfkF',
    socket: {
        host: 'redis-18065.c305.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 18065
    }
});


// const connectradis = async ()=>{
//     await radisclient.connect();
//     console.log("connected to DB")

// }
// connectradis();
module.exports = redisclient


// const redis = require("redis");

// const redisClient = redis.createClient({
//     username: 'default',
//     password: 'RfLuoscAAX5aFpzI9ZPyCNL1rwMvBfkF',
//     socket: {
//         host: 'redis-18065.c305.ap-south-1-1.ec2.redns.redis-cloud.com',
//         port: 18065,
//         // Add these options for better connection handling
//         connectTimeout: 60000,
//         lazyConnect: true,
//         reconnectStrategy: (retries) => {
//             if (retries > 10) {
//                 return new Error('Too many retries');
//             }
//             return Math.min(retries * 50, 1000);
//         }
//     }
// });

// // Essential error handling
// redisClient.on('error', (err) => {
//     console.error('Redis Client Error:', err);
// });

// redisClient.on('connect', () => {
//     console.log('Connected to Redis Cloud');
// });

// redisClient.on('reconnecting', () => {
//     console.log('Reconnecting to Redis...');
// });

// redisClient.on('ready', () => {
//     console.log('Redis client ready');
// });

// // Connect explicitly
// const connectRedis = async () => {
//     try {
//         if (!redisClient.isOpen) {
//             await redisClient.connect();
//         }
//     } catch (error) {
//         console.error('Failed to connect to Redis:', error);
//     }
// };

// connectRedis();

// module.exports = redisClient;