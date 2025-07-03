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
    port: process.env.REDIS_PORT,
    user: process.env.REDIS_DB_USER,
    hasPassword: !!process.env.REDIS_DB_PASS
});

const redisClient = redis.createClient({
    username: process.env.REDIS_DB_USER,
    password: process.env.REDIS_DB_PASS,
    socket: {
        host: process.env.REDIS_URL,
        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
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




console.log('=== ENVIRONMENT VARIABLES DEBUG ===');
console.log('REDIS_URL:', process.env.REDIS_URL);
console.log('REDIS_PORT:', process.env.REDIS_PORT);
console.log('REDIS_DB_USER:', process.env.REDIS_DB_USER);
console.log('REDIS_DB_PASS:', process.env.REDIS_DB_PASS ? '***SET***' : 'NOT SET');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('=== END DEBUG ===');

module.exports = redisClient;
