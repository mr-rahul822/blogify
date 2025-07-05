

// const redis = require("redis");

// // Add debugging to see what values are being used
// console.log('Redis Config:', {
//     host: process.env.REDIS_URL,
//     port: process.env.REDISPORT,
//     user: process.env.REDISUSER,
//     hasPassword: !!process.env.REDISPASSWORD
// });

// const redisClient = redis.createClient({
//     username: process.env.REDISUSER,
//     password: process.env.REDISPASSWORD,
//     socket: {
//         host: process.env.REDIS_URL,
//         port: parseInt(process.env.REDISPORT, 10) || 6379,
//         family: 4,
//         connectTimeout: 10000,
//         lazyConnect: true
//     }
// });

// redisClient.on('error', (err) => {
//     console.error('Redis connection error:', err);
// });

// redisClient.on('connect', () => {
//     console.log('Connected to Redis Cloud successfully');
// });




// module.exports = redisClient;

// const redis = require("redis");


// // Add debugging to see what values are being used
// console.log('Redis Config:', {
//     url: process.env.REDIS_URL,
//     host: process.env.REDIS_HOST,
//     port: process.env.REDIS_PORT,
//     user: process.env.REDIS_USER,
//     hasPassword: !!process.env.REDIS_PASSWORD
// });

// const redisClient = redis.createClient({
//     username: process.env.REDIS_USER,
//     password: process.env.REDIS_PASSWORD,
//     socket: {
//         host: process.env.REDIS_HOST,  // Changed from REDIS_URL to REDIS_HOST
//         port: parseInt(process.env.REDIS_PORT, 10) || 6379,  // Changed from REDISPORT to REDIS_PORT
//         family: 4,
//         connectTimeout: 10000,
//         lazyConnect: true
//     }
// });


// redisClient.on('error', (err) => {
//     console.error('Redis connection error:', err);
// });

// redisClient.on('connect', () => {
//     console.log('Connected to Redis Cloud successfully');
// });

// module.exports = redisClient;




const redis = require("redis");

// Parse the Redis URL like in your BullMQ example
const redisURL = new URL(process.env.REDIS_URL);

// Add debugging to see what values are being used
console.log('Redis Config:', {
    url: process.env.REDIS_URL,
    hostname: redisURL.hostname,
    port: redisURL.port,
    username: redisURL.username,
    hasPassword: !!redisURL.password
});

const redisClient = redis.createClient({
    username: redisURL.username,
    password: redisURL.password,
    socket: {
        host: redisURL.hostname,
        port: parseInt(redisURL.port, 10) || 6379,
        family: 0,  // Keep as 4 for IPv4, or change to 0 like your BullMQ example
        connectTimeout: 10000,
        lazyConnect: true
    }
});

redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
});

redisClient.on('connect', () => {
    console.log('Connected to Redis Cloud successfully');
});

module.exports = redisClient;