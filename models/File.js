const mongoose = require('mongoose');
const nodemailer = require("nodemailer");

const fileSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String
    },
    imageUrl:{
        type:String
    },
    tags:{
        type:String
    }
})


//post middleware

fileSchema.post("save",async function(doc){ //jo bhi entry database mein create hui hai usi ko hm doc bol rhe hai
    try{
        console.log("Doc",doc)

        //transporter
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            }
        });

        //send mail
        let info = await transporter.sendMail({
            from:`Devdatt`,
            to:doc.email,
            subject:"New file uploaded on cloudinary",
            html:`<h2>Hello </h2> <p>File Uploaded View here : <a href="${doc.imageUrl}">${doc.imageUrl}</a></p>`
        })

        console.log("INFO",info);
    }
    catch(error){
        console.error(error);
    }
})


module.exports = mongoose.model("File",fileSchema);