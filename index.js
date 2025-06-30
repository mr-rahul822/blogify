const express =  require("express")
const path =  require("path")
// require("dotenv").config()
const userRouter = require("./Routes/user")
const blogRouter = require("./Routes/blog")
const main = require("./database")
const cookieParser = require("cookie-parser")
const redisclient = require("./config/redis")




const app = express()
app.use(cookieParser());

app.use(express.json());


// Serve static files like HTML from "public" folder
app.use(express.static(path.join(__dirname, 'public')))
app.set("view engine", "ejs")
app.set("views" , path.join(__dirname,"views"))
app.use(express.urlencoded({ extended: true }));

// app.get("/",(req,res)=>{
//     res.render("home", { showNavbar: false, user: req.user  });
// })

app.get("/",  (req, res) => {
    res.render("home", { 
        showNavbar: true,  // Show navbar on authenticated pages
        user: req.user 
    });
});

app.use("/user",userRouter)
app.use("/user",blogRouter )



const InitlizeConnection = async ()=>{
    try{
        // await main()
        // console.log("DB connected")

        // await Promise.all([redisclient.connect(),main()]);
        // console.log("DB connected!")

        
    await redisclient.connect();
    console.log("connected to DB")

    await main()
    console.log("connected to mongoDB")

    app.listen(8000, () =>{
    console.log("server started on port 8000: ")
    })

    }catch(err){
        console.log("error" + err)
    }

}

InitlizeConnection();



