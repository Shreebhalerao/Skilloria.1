const express= require("express")
const app =express();
const userRoutes =require("./routes/User");
const paymentRoutes =require("./routes/Payments");
const profileRoutes =require("./routes/Profile");
const courseRoutes =require("./routes/Course");
const database = require("./config/database");
const cookieParser =require("cookie-parser");
const cors = require("cors");
const{cloudinaryConnect}=require("./config/cloudinary");
const fileupload=require("express-fileupload");
const dotenv = require("dotenv");

dotenv.config();
const PORT = 2000;
//db conn
database.connect();
//middlewares
app.use(express.json());
app.use(cookieParser());
//connce to the frontend request
app.use(
    cors({
        origin: "https://skilloria-1.vercel.app", 
        credentials:true,
    })
)
app.use(
    fileupload({
        useTempFiles:true,
        tempFileDir:"/tmp",
    })
)
//connect to the cloudinary
cloudinaryConnect();
// mount route
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});
app.use('/api/auth', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/course', courseRoutes);
//routes
app.get("/",(req,res)=>{
    return res.json({
        success:true,
        message:'your server os up and running...'
    });
});

app.listen(PORT, ()=>{
    console.log(`app is running at the ${PORT}`)
})
