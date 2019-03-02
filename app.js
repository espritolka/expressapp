const express = require("express");
const fs = require("fs");

const app = express();
app.use(function (request, response, next) {

    let now = new Date();
    let hour = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    let data = `${hour}:${minutes}:${seconds} ${request.method} ${request.url} ${request.get("user-agent")}`;
//    console.log(data);
    fs.appendFile("server.log", data + "\n", function () { });
    next();
});
app.use("/static", express.static(__dirname + "/public"));

app.use("/yandex(.ru)?",function (request, response) {
    response.redirect("https://yandex.ru")
  });
app.use("/home/foo/bar/404", function (request, response) {
    //   response.sendStatus(404)
    response.status(404).send(`Ресурс не найден`);
   });
app.use("/home/foo/bar",function (request, response) {
      response.redirect(301, ".")
});   //переадресация на уровень выше
app.use("/index/lol",function (request, response) {
    response.redirect("..")
  }); //переадресация на 2 уровня выше
  app.get("/home/foo", function (request, response) {
    response.send("Hello foo page");
});
app.use("/about", function(request, response){
      
    let id = request.query.id;
    let userName = request.query.name;
    response.send("<h1>Информация</h1><p>id=" + id +"</p><p>name=" + userName + "</p>");
});
app.use("/users", function(request, response){
      
    console.log(request.query);
    let names = request.query.name;
    let responseText = "<ul>";
    for(let i=0; i < names.length; i++){
        responseText += "<li>" + names[i] + "</li>";
    }
    responseText += "</ul>";
    response.send(responseText);
});
app.use("/globalusers", function(request, response){
      
    console.log(request.query);
    let id = request.query.user.id;
    let name = request.query.user.name;
     
    response.send("<h3>id:" + id + "<br>name: " + name +"</h3>");
});
  app.get("/home", function (request, response) {
    response.send("Hello home page");
});
app.use("/index", function (request, response) {
    response.sendFile(__dirname + "/index.html");
});
app.get("/", function (request, response) {
    response.send("Hello main page");
});

app.listen(3000);