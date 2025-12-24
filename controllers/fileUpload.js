const File = require('../models/File')
const cloudinary = require('cloudinary').v2;

//localFileUpload -> logic

exports.localFileUpload = async (req,res)=>{
    try{
        //fetch the file from request ki body
        const file = req.files.file;
        console.log("file",file);
        
        //path do jha pe store krni server pe
        let path = __dirname + "/files/" + Date.now() + `.${file.name.split('.')[1]}`
        console.log("path",path);

        //move the file to that path
        file.mv(path,(error)=>{
            console.log("failed to move file");
        })

        res.json({
            success:true,
            message:"file moved successfully"
        })
    }
    catch(error){
        console.log("file cannot be fetched")
        console.log(error);
    }
}

//image upload

function isFileTypeSupported(fileType,supportedTypes){
    return supportedTypes.includes(fileType);
}

async function uploadFileToCloudinary(file,folder){
    //ye folder apna woh hai jispe image store krni hai cloudinary pe
    const options = {folder}
    options.resource_type = "auto"; //ye auto isliye krte hai taki jo bhi file ho uske hisab se cloudinary apne aap decide krle ki konsa resource type hoga jaise image/video/other
    return await cloudinary.uploader.upload(file.tempFilePath,options); //ye tempFilePath woh hai jo server ke upar bnta hai aur jaise hi file media server pe upload krte hai toh ye tempFIle path hat jata hai
}

exports.imageUpload = async (req,res) =>{
    try{
    //fetch data
    const {name,email,tags} = req.body;
    console.log(name,email,tags);
    
    const file = req.files.imageFile;
    console.log("image file",file);

    //validation
    const supportedTypes = ['jpg','png','jpeg'];
    const fileType = file.name.split('.')[1].toLowerCase();
    console.log("file type",fileType);

    if(!isFileTypeSupported(fileType,supportedTypes)){
        return res.status(400).json({
            success:false,
            message:"file type not supported"
        })  
    }
 
    //file type supported 

    const response = await uploadFileToCloudinary(file,"codehelp");
    console.log(response);

    //store details in db
    const fileData = await File.create({
        name,
        email,
        tags,
        imageUrl: response.secure_url
    })

    res.json({
        success:true,
        imageUrl: response.secure_url,
        message:"image uploaded successfully",
    })

    }    
    catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"image upload failed"
        })
    }
}

//video upload

exports.videoUpload = async (req,res) =>{
    try{
    //fetch data
    const {name,email,tags} = req.body;
    console.log(name,email,tags);
    
    const file = req.files.videoFile;
    console.log("video file",file);

    //validation
    const supportedTypes = ['mp4','mov'];
    const fileType = file.name.split('.')[1].toLowerCase();
    console.log("file type",fileType);

    if(!isFileTypeSupported(fileType,supportedTypes)){
        return res.status(400).json({
            success:false,
            message:"file type not supported"
        })  
    }
 
    //file type supported 

    const response = await uploadFileToCloudinary(file,"codehelp");
    console.log(response);

    //store details in db
    const fileData = await File.create({
        name,
        email,
        tags,
        imageUrl: response.secure_url
    })

    res.json({
        success:true,
        imageUrl: response.secure_url,
        message:"video uploaded successfully",
    })

    }    
    catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"video upload failed"
        })
    }
}

//image size reducer

exports.imageSizeReducer = async (req,res) =>{
    try{
    //fetch data
    const {name,email,tags} = req.body;
    console.log(name,email,tags);   
    const file = req.files.imageFile;
    console.log("image file",file);
    //validation
    const supportedTypes = ['jpg','png','jpeg'];
    const fileType = file.name.split('.')[1].toLowerCase();
    console.log("file type",fileType);
    if(!isFileTypeSupported(fileType,supportedTypes)){
        return res.status(400).json({
            success:false,  
            message:"file type not supported"
        })  
    }   
    //file type supported
    const options = {
        folder:"codehelp",
        transformation:[
            {width:500,height:500,crop:"limit"}
        ]
    }
    const response = await cloudinary.uploader.upload(file.tempFilePath,options);
    console.log(response);
    //store details in db
    const fileData = await File.create({
        name,
        email,
        tags,
        imageUrl: response.secure_url
    })
     
    res.json({
        success:true,
        imageUrl: response.secure_url,
        message:"image uploaded successfully",
    })

    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"image upload failed"
        })
    }
}