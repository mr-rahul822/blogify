// const redis = require("redis")

// const redisclient = redis.createClient({
//     username: process.env.RADIS_DB_USER,
//     password: process.env.RADIS_DB_PASS,
//     socket: {
//         host: process.env.REDIS_URL,
//         port: process.env.RADIS_PORT
//     }
// });

// redisClient.on('error', (err) => {
//   console.error('Redis connection error:', err);
// });



// module.exports = redisclient

// const redis = require("redis");

// const redisClient = redis.createClient({
//     username: process.env.REDIS_DB_USER,
//     password: process.env.REDIS_DB_PASS,
//     socket: {
//         host: process.env.REDIS_URL,
//         port: parseInt(process.env.REDISPORT, 10) || 6379,
//         family: 4,
//         connectTimeout: 10000,
//         lazyConnect: true // ✅ always parse to number
//     }
// });

// redisClient.on('error', (err) => {
//     console.error('Redis connection error:', err);
// });


// module.exports = redisClient;


const redis = require("redis");

// Add debugging to see what values are being used
console.log('Redis Config:', {
    host: process.env.REDIS_URL,
    port: process.env.REDISPORT,
    user: process.env.REDIS_DB_USER,
    hasPassword: !!process.env.REDIS_DB_PASS
});

const redisClient = redis.createClient({
    username: process.env.REDIS_DB_USER,
    password: process.env.REDIS_DB_PASS,
    socket: {
        host: process.env.REDIS_URL,
        port: parseInt(process.env.REDISPORT, 10) || 6379,
        family: 4,
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
