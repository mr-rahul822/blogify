require("dotenv").config()

const express =  require("express")
const path =  require("path")

const userRouter = require("./Routes/user")
const blogRouter = require("./Routes/blog")
const main = require("./database")
const cookieParser = require("cookie-parser")
const redisclient = require("./config/redis")
const USERBLOGS = require("./Models/blogdatabase");
const mongoose = require("mongoose")




const app = express()
app.use(cookieParser());
app.use(express.json());


app.use(express.static(path.join(__dirname, 'public')))
app.set("view engine", "ejs")
app.set("views" , path.join(__dirname,"views"))
app.use(express.urlencoded({ extended: true }));

const PORT =process.env.PORT


app.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        let blogs = await USERBLOGS.find({ published: true })
            .populate('author', 'name username')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        if (blogs.length === 0) {
            console.log("No published blogs found, trying all blogs...");
            blogs = await USERBLOGS.find({})
                .populate('author', 'name username')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
        }

        const totalBlogs = await USERBLOGS.countDocuments({ published: true }) ||
                           await USERBLOGS.countDocuments({});

        const totalPages = Math.ceil(totalBlogs / limit);

        console.log(`Rendering ${blogs.length} blogs`);

        res.render("home", {
            title: "Blogify - Where Stories Come to Life",
            blogs: blogs,
            image:image,
            currentPage: page,
            totalPages: totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
            nextPage: page + 1,
            prevPage: page - 1,
        });
    } catch (error) {
        console.error("Error in home route:", error);
        res.status(500).json({
            error: "Internal server error",
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// app.get("/", (req, res) => {
//     res.json({ message: "Hello from Railway!", port: PORT });
// });

app.get("/health", (req, res) => {
    console.log("Health check hit");
    res.json({ 
        status: "OK", 
        port: PORT,
        timestamp: new Date().toISOString()
    });
});



app.use("/user",userRouter)
app.use("/user",blogRouter )



const InitlizeConnection = async () => {
    try {
        // Connect to MongoDB
        await main();
        console.log("connected to mongoDB");
        
        // Try Redis (don't let it block)
        await redisclient.connect()
            .then(() => console.log("Redis connected"))
            .catch(err => console.error("Redis connection error:", err));

        // Start server
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`server started on port ${PORT}`);
        });

    } catch (err) {
        console.error("Initialization error:", err);
        // Start server anyway for debugging
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`server started on port ${PORT} (with errors)`);
        });
    }
}

InitlizeConnection();




