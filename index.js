//app create
const express = require("express")
const app = express();

//port find 
require("dotenv").config();
const PORT = process.env.PORT;

//middleware
app.use(express.json());
const fileupload = require("express-fileupload");
app.use(fileupload({
    useTempFiles:true,
    tempFileDir:"/tmp/"
}));

//db se connect krenge
require("./config/database").connectWithDb();

//cloud se connect krenge
require("./config/cloudinary").cloudinaryConnect();

//api routes mount krenge
const routes = require('./routes/FileUpload')
app.use('/api/v1/upload',routes);

//server activate
app.listen(PORT,()=>{
    console.log(`server started at port ${PORT}`)
})

app.get('/',(req,res)=>{
    res.send("<h1>THis is homepage</h1>")
})