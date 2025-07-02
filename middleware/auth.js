const jwt = require("jsonwebtoken");
const USER = require("../Models/userdatabase")
const redisclient = require("../config/redis");
const USERBLOGS = require("../Models/blogdatabase");




const auth = async (req, res, next) => {
    try {
        // Import cookies
        const { token } = req.cookies;
        

        // Check if token exists
        if (!token) {
            
            return res.redirect("/user/signin");
        }

        // Verify JWT token
        let payload;
        try {
            payload = jwt.verify(token, process.env.ENC_SECRET_KEY );
            
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
        
        
        if (!user) {
            console.log('User not found in database');
            return res.redirect("/user/signin");
        }

        // Check if token is blocked in Redis
        
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
        
        return res.render("signin", { 
            error: "Authentication failed. Please sign in again." 
        });
    }
};

// 

const CheckBlogOwnership = async (req, res, next) => {
    try {
        const blogId = req.params.id || req.params.slug;
        
        // Find blog by ID or slug
        let blog;
        if (req.params.slug) {
            blog = await USERBLOGS.findOne({ slug: req.params.slug });
        } else {
            blog = await USERBLOGS.findById(blogId);
        }

        if (!blog) {
            return res.status(404).render("404", {
                title: "Blog Not Found",
                message: "The blog post you are looking for does not exist.",
            });
        }

        // Check if the current user is the author of the blog
        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(403).render("error", {
                message: "Unauthorized - You can only access your own blogs",
                status: 403,
            });
        }

        // Store blog in request for later use
        req.blog = blog;
        next();
    } catch (error) {
        console.error("Blog ownership check error:", error);
        return res.status(500).render("error", {
            message: "Server error",
            status: 500,
        });
    }
}

module.exports =  auth, CheckBlogOwnership


// module.exports = auth;