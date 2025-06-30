const express = require("express")
const router  =  express.Router()
const USER = require("../Models/userdatabase")
const validUser =  require("../Validators/validate")
const bcrypt = require("bcrypt")
const JWT =  require("jsonwebtoken")
const redisclient = require("../config/redis")
const auth = require("../middleware/auth")

router.get("/signin", (req,res)=>{
    return res.render("signin",{ 
        showNavbar: false,  // Don't show navbar on signin page
        error: null 
    });
})

router.get("/signup",(req,res)=>{
    return res.render("signup")
})

router.post("/signup", async (req,res)=>{
    // validate user
    // validUser(req.body)
    
 
    // register user
    const {fullname, email, password } = req.body


    await USER.create({
        fullname,
        email,
        password
    })

    return res.redirect("/user/signin")

})

router.post("/signin", async (req,res)=>{
    try{
        const {email , password} = req.body;

        const user = await USER.findOne({email});

        const IsAllowed = await bcrypt.compare(password, user.password);
        // console.log(IsAllowed)
        if(!IsAllowed){
           return res.render("signin", { 
            showNavbar: false,
            error: "Invalid credentials" 
        })
        }

        // creating jwt token 
        const token  =  user.getJWT();
        // const token  = JWT.sign({id:this._id,email:this.email},"Blogify@user",{expiresIn: "1h"});
        // send token in cookie 
        // console.log(token)

        res.cookie("token" , token,{
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24 // 1 day
        })

        return res.redirect("/user/blog")
    }
    catch(err){
        console.log(err)
        // return res.status(500).send("server error")
          return res.render("signin", { 
            showNavbar: false,
            error: "Something went wrong" 
        });
    }
})

// router.post("/logout", auth, async (req,res)=>{
//    try{
//         // // const token = req.
//          const token = req.cookies.token;
        

//          const payload = JWT.decode(token);
//         // console.log("Decoded payload:", payload);

//         // res.clearCookie("token", { path: "/" });  direct expriere at
//         await redisclient.set(`token ${token}`,"blocked")
//         console.log(redisclient)

//         await redisclient.expireAt(`token :${token}`,payload.exp);

//         res.cookie("token",null,{expires: new Date(Date.now())});

//         return res.redirect("/user/signin");
    
//         // return res.redirect("/user/signin")
//    }
//    catch(err){
//     res.redirect("/user/signin")
//    }
        
// })



// // Alternative version with better error handling and success message
// router.post("/logout", auth, async (req, res) => {
//     try {
//         const token = req.cookies.token;
        
//         if (!token) {
//             return res.redirect("/user/signin");
//         }

//         const payload = JWT.decode(token);
        
//         if (payload && payload.exp) {
//             // Add to Redis blocklist with consistent key format
//             const redisKey = `blocked_token:${token}`;
            
//             // Use pipeline for better performance
//             const pipeline = redisclient.pipeline();
//             pipeline.set(redisKey, "blocked");
//             pipeline.expireAt(redisKey, payload.exp);
//             await pipeline.exec();
            
//             console.log('Token successfully blocked in Redis');
//         }

//         // Clear cookie properly
//         res.clearCookie("token", { 
//             path: "/",
//             httpOnly: true,
//             // secure: process.env.NODE_ENV === 'production'
//         });

//         // Redirect with success message (if you want to show a message)
//         return res.redirect("/user/signin");

//     } catch (err) {
//         console.error('Logout error:', err);
        
//         // Always clear cookie even on error
//         res.clearCookie("token", { path: "/" });
//         return res.redirect("/user/signin");
//     }
// });


// Simple version without batch operations (most reliable)
router.post("/logout", auth, async (req, res) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.redirect("/user/signin");
        }

        const payload = JWT.decode(token);
        
        if (payload && payload.exp) {
            const redisKey = `blocked_token:${token}`;
            // console.log(redisKey+"bloked_token")
            
            // Sequential operations (more reliable for different Redis clients)
            await redisclient.set(redisKey, "blocked");
            await redisclient.expireAt(redisKey, payload.exp);
            
            // console.log('Token successfully blocked in Redis');
        }

        // Clear cookie properly
        res.clearCookie("token", { 
            path: "/",
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production'
        });

        // console.log('User logged out successfully');
        return res.redirect("/user/signin");

    } catch (err) {
        console.error('Logout error:', err);
        
        // Always clear cookie even on error
        res.clearCookie("token", { path: "/" });
        return res.redirect("/user/signin");
    }
});


module.exports = router;