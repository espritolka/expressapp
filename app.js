const express = require("express");
const fs = require("fs");

const app = express();
app.use(function (request, response, next) {

    let now = new Date();
    let hour = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    let data = `${hour}:${minutes}:${seconds} ${request.method} ${request.url} ${request.get("user-agent")}`;
    console.log(data);
    fs.appendFile("server.log", data + "\n", function () { });
    next();
});
app.use("/index", function (request, response) {
    response.sendFile(__dirname + "/index.html");
});
app.get("/", function (request, response) {
    response.send("Hello");
});
app.use("/home/foo/bar", function (request, response) {
 //   response.sendStatus(404)
 response.status(404).send(`Ресурс не найден`);
});
app.listen(3000);