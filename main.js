const express = require("express");

const db = require("./db");

const index = require("./controllers/index");
const upload = require("./controllers/upload");
const download = require("./controllers/download");
const downloadTorrent = require("./controllers/downloadTorrent");

const auth = require("http-auth");
const multer = require("multer");
const config = require("./config.json");

function setup(){
    const app = express();
    app.set("view engine","ejs");
    app.set("views",__dirname + "/views");

    let basic = auth.basic({
        realm: "Upload PPT"
    }, function (username, password, callback) {
        callback(username === config.username && password === config.password);
    });

    app.use("/static",express.static("static"));

    app.get("/",index);
    app.get("/download/:id",download);
    app.get("/downloadTorrent/:id",downloadTorrent);
    app.get("/upload",auth.connect(basic),upload.get);
    app.post("/upload",auth.connect(basic),multer({dest: "./static/"}).any(),upload.post);

    return app;
}

if(require.main === module){
    let app = setup();

    app.listen(5454,function(){
        db.sync()
            .then(()=>{
                console.log("Presentaciones running at 5454");
            })
            .catch((e)=>{
                console.error("Error with Sequelize-MariaDB");
                console.error(e);
            });
        
    });
}


module.exports = {
    setup: setup
};