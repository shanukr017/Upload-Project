const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const multer = require('multer');
const app = express();
const ejs = require('ejs');
const path = require('path');
const storeData = require("./back/schema");
const { log } = require('console');
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');



const upLoad = multer({
    storage : multer.diskStorage({
        destination : function(req,file,cb){
            cb(null,'storeFiles');
        },
        filename : function(req,file,cb){
            cb(null,file.fieldname+"_"+req.body.pin+""+".pdf");
        }
    })
});

app.get("/index",(req,res)=>{
    var sendF = path.join(__dirname+"/index.html");
    res.sendFile(sendF);
})


app.get("/",(req,res)=>{
    var sendF = path.join(__dirname+"/main.html");
    res.sendFile(sendF);
})
app.post("/save",upLoad.single("newFile"),async (req,res)=>{
    console.log(req.body);
    var num1 = Math.ceil(Math.random()*10000);
    var num2 = Math.ceil(Math.random()*10000);
    var num = num1+""+num2;
    const insertData = new storeData({
        keyNumber : num+""+req.body.pin,
        fileName : "newFile"+"_"+req.body.pin+"."+req.body.format
    })
    fs.renameSync(__dirname+"/storeFiles/newFile_undefined.pdf",__dirname+"/storeFiles/newFile"+"_"+req.body.pin+"."+req.body.format);
    var sendMs = num+""+req.body.pin;
    res.render('save',{sendMs});
    await insertData.save();
});

app.get("/fetch",(req,res)=>{
    var sendF = path.join(__dirname+"/fetch.html");
    res.sendFile(sendF);
})

app.post("/getPdf",async(req,res)=>{
    var data = await storeData.find({keyNumber:req.body.valueFind});
    console.log(data);
    var resfileName = data[0].fileName;
    var joinF = path.join(__dirname+`/storeFiles/${resfileName}`);
    res.sendFile(joinF);
})
app.listen(3000);

