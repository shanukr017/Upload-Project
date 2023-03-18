const express = require('express');
const mailer = require('nodemailer');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const multer = require('multer');
const app = express();
const ejs = require('ejs');
const path = require('path');
const storeData = require("./back/storeEntry");
const { log } = require('console');
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');

app.use('/css',express.static(path.join(__dirname,'css')));
app.use('/img',express.static(path.join(__dirname,'images')));

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


app.get("/",async (req,res)=>{
    var sendF = path.join(__dirname+"/main.html");
    res.sendFile(sendF);
})
app.post("/save",upLoad.single("newFile"),async (req,res)=>{
    console.log(req.body);
    var num1 = Math.ceil(Math.random()*10000);
    var num2 = Math.ceil(Math.random()*10000);
    var num = num1+""+num2;
    var resf = await bcrypt.hash(req.body.pass,10);
    const insertData = new storeData({
        keyNumber : num+""+req.body.pin,
        fileName : "newFile"+"_"+num+""+req.body.pin+"."+req.body.format,
        originalFileName : req.body.ogFileName
    })
    insertData.filePassword = resf;
    fs.renameSync(__dirname+"/storeFiles/newFile_undefined.pdf",__dirname+"/storeFiles/newFile"+"_"+num+""+req.body.pin+"."+req.body.format);
    var sendMs = num+""+req.body.pin;
    res.render('save',{sendMs});
    console.log(insertData);
    await insertData.save();
});

app.get("/fetch",(req,res)=>{
    // var sendF = path.join(__dirname+"/fetch.html");
    // res.sendFile(sendF);
    var msgs = "";
    res.render('nakli',{msgs});
})

app.post("/getPdf",async(req,res)=>{
   // var resf = bcrypt.compare(req.body.pass);
    var resf = false;
    var data = await storeData.find({keyNumber:req.body.valueFind})
    console.log(data);
    //res.send("ok");
    if(data.length!=0){
        var resf = await bcrypt.compare(req.body.pass,data[0].filePassword);
         //console.log(data[0].filePassword);
    }
    if(resf){
        var resfileName = data[0].fileName;
        var joinF = path.join(__dirname+`/storeFiles/${resfileName}`);
        res.sendFile(joinF);
    }
    else{
        //res.send({authenthication:"failed",acknowledgment:"false"});
        var msgs = "Not Valid Credentials";
        res.render('nakli',{msgs});
    }
});

app.get("/list",async(req,res)=>{
    let data = await storeData.find();
    res.render('read',{data});
})

app.listen(3000);

