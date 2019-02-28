const express = require("express");
const fs = require("fs");
 
const app = express();
app.use(function(request, response, next){
     
    let now = new Date();
    let hour = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    let data = `${hour}:${minutes}:${seconds} ${request.method} ${request.url} ${request.get("user-agent")}`;
    console.log(data);
    fs.appendFile("server.log", data + "\n", function(){});
    next();
});
app.use(function (request, response) {
    response.send(`<!DOCTYPE html>
    <html>
    <head>
        <title>Главная</title>
        <meta charset="utf-8" />
    </head>
    <body>
        <h1>Главная страница</h1>
        <h3>Привет, Express</h3>
    </body>
    <html>`);
  }); 
app.get("/", function(request, response){
    response.send("Hello");
});
app.listen(3000);