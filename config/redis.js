const redis = require("redis")

const redisclient = redis.createClient({
    username: process.env.RADIS_DB_USER,
    password: process.env.RADIS_DB_PASS,
    socket: {
        host: process.env.RADIS_HOST,
        port: process.env.RADIS_PORT
    }
});



module.exports = redisclient

