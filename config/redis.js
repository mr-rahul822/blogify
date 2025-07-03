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

const redis = require("redis");

const redisClient = redis.createClient({
    username: process.env.REDIS_DB_USER,
    password: process.env.REDIS_DB_PASS,
    socket: {
        host: process.env.REDIS_URL,
        port: parseInt(process.env.REDIS_PORT, 10) // ✅ always parse to number
    }
});

redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
});

module.exports = redisClient;
