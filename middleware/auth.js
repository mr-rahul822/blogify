const jwt = require("jsonwebtoken");
const USER = require("../Models/userdatabase")
const redisclient = require("../config/redis");



// const auth = async (req, res, next) =>{
   
//     try{
//     // import cookies
//         const {token}  = req.cookies
//             console.log(token)


//         if(!token){
//             return res.redirect("/user/signin");
//             console.log(token + "token nhi h from auth")
//         }

//     // veryfy cookies
//     const payload = jwt.verify(token,"Blogify@user")
//     console.log("payload from auth "+payload)
//     if(!payload || !payload.id){
//         return res.redirect("/user/signin")
//     }

//     //token(find user)  veryfy by id
//     const result = await USER.findById(payload.id);
//     console.log("result from auth "+ result)
//     if(!result){
//         return res.redirect("/user/signin")
//     }

//     const IsBlocked = await redisclient.exists(`token: ${token}`);
//     console.log(IsBlocked+ "token block ho gya")
//         if(!IsBlocked)
//         return res.redirect("/user/signin")
//         console.log(IsBlocked+ "Isblocked nhi h from auth")

            
//     // attach user to request
//     req.user = result;
//     // console.log(req.user)

//     next();
//     }
//     catch(err){
//         return res.render("signin","logout", {err : "JWT error by redis" })
//     }

// };

const auth = async (req, res, next) => {
    try {
        // Import cookies
        const { token } = req.cookies;
        // console.log('Token from cookies:', token);

        // Check if token exists
        if (!token) {
            // console.log('No token found, redirecting to signin');
            return res.redirect("/user/signin");
        }

        // Verify JWT token
        let payload;
        try {
            payload = jwt.verify(token, "Blogify@user");
            // console.log("Payload from auth:", payload);
        } catch (jwtError) {
            console.log('JWT verification failed:', jwtError.message);
            return res.redirect("/user/signin");
        }

        // Check payload validity
        if (!payload || !payload.id) {
            console.log('Invalid payload structure');
            return res.redirect("/user/signin");
        }

        // Find user by ID from payload
        const user = await USER.findById(payload.id);
        // console.log("User found:", user ? `User ID: ${user._id}` : 'No user found');
        
        if (!user) {
            console.log('User not found in database');
            return res.redirect("/user/signin");
        }

        // Check if token is blocked in Redis
        // FIXED: Logic was inverted - if token exists in blocklist, it's blocked
        const isTokenBlocked = await redisclient.exists(`blocked_token:${token}`);
        // console.log('Token blocked status:', isTokenBlocked);
        
        if (isTokenBlocked) {
            console.log('Token is blocked, redirecting to signin');
            return res.redirect("/user/signin");
        }

        // Attach user to request object
        req.user = user;
        // console.log('User authenticated successfully');

        // Continue to next middleware
        next();

    } catch (err) {
        console.error('Authentication error:', err);
        // FIXED: Proper error response - render signin page with error
        return res.render("signin", { 
            error: "Authentication failed. Please sign in again." 
        });
    }
};

module.exports = auth;

// module.exports = auth;