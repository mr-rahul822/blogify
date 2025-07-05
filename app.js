require("dotenv").config()

const express =  require("express")
const path =  require("path")

const userRouter = require("./Routes/user")
const blogRouter = require("./Routes/blog")
const main = require("./database")
const cookieParser = require("cookie-parser")
const redisclient = require("./config/redis")
const USERBLOGS = require("./Models/blogdatabase");




const app = express()
app.use(cookieParser());
app.use(express.json());


app.use(express.static(path.join(__dirname, 'public')))
app.set("view engine", "ejs")
app.set("views" , path.join(__dirname,"views"))
app.use(express.urlencoded({ extended: true }));


// Simplified home route that should work
app.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        // Try the simplest query first
        let blogs = await USERBLOGS.find({ published: true })
            .populate('author', 'name username')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // If no blogs found with published: true, try without filters
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
            currentPage: page,
            totalPages: totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
            nextPage: page + 1,
            prevPage: page - 1,
            
            
        });
    } catch (error) {
        console.error("Error in home route:", error);
        res.render("home", {
            title: "Blogify - Where Stories Come to Life",
            blogs: [],
            currentPage: 1,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false
        });
    }
});



app.use("/user",userRouter)
app.use("/user",blogRouter )


const PORT =process.env.PORT ||8080
const InitlizeConnection = async ()=>{
    try{
        
    await redisclient.connect()
    .then(() => console.log("Redis connected"))
    .catch(err => console.error("Redis connection error:", err));
    // console.log("connected to DB")

    await main()
    console.log("connected to mongoDB")

    // await Promise.all([redisclient.connect(),main()]);
    // console.log("DB connected!")
    

    app.listen(PORT ,'0.0.0.0', () =>{
    console.log(`server started on port ${process.env.PORT}: `)
    })

    }catch(err){
        console.log("error" + err)
    }

}

InitlizeConnection();



