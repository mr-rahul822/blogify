

const redis = require("redis");

// Add debugging to see what values are being used
console.log('Redis Config:', {
    host: process.env.REDIS_URL,
    port: process.env.REDISPORT,
    user: process.env.REDISUSER,
    hasPassword: !!process.env.REDISPASSWORD
});

const redisClient = redis.createClient({
    username: process.env.REDISUSER,
    password: process.env.REDISPASSWORD,
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
