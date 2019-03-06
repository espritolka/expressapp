const express = require("express");
const hbs = require("hbs");
// const expressHbs = require("express-handlebars");
const fs = require("fs");
const bodyParser = require("body-parser"); // определяем Router
const productRouter = express.Router();
const jsonParser = express.json(); // создаем парсер для данных в формате json
const app = express();
const urlencodedParser = bodyParser.urlencoded({extended: false}); //парсер для получения отправленных данных 

//устанавливаем настройки для файлов layout
app.set("view engine", "hbs");
// app.engine("hbs", expressHbs(
//     {
//         layoutsDir: "views/layouts", 
//         defaultLayout: "layout",
//         extname: "hbs",
//         partialsDir: __dirname + '/views/partials/'
//     }
// ))
//hbs.registerPartials(__dirname + "/views/partials");
hbs.registerHelper("getTime", function(){
     
    var myDate = new Date();
    var hour = myDate.getHours();
    var minute = myDate.getMinutes();
    var second = myDate.getSeconds();
    if (minute < 10) {
        minute = "0" + minute;
    }
    if (second < 10) {
        second = "0" + second;
    }
    return "Текущее время: " + hour + ":" + minute + ":" + second;
});
hbs.registerHelper("createStringList", function(array){
	
	var result="";
	for(var i=0; i<array.length; i++){
		result +="<li>" + array[i] + "</li>";
	}
	return new hbs.SafeString("<ul>" + result + "</ul>");
});

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

app.get("/register(.html)?", urlencodedParser, function (request, response) {
    response.sendFile(__dirname + "/register.html");
});
app.post("/register", urlencodedParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    console.log(request.body);
    response.send(`${request.body.userName} - ${request.body.userAge}`);
});
  
app.use("/about", function (request, response) {
    response.send("О сайте");
  });
 // определяем маршруты и их обработчики внутри роутера
productRouter.use("/create", function(request, response){
    response.send("Добавление товара");
  });
  productRouter.use("/:id", function(request, response){
    response.send(`Товар ${request.params.id}`);
  });
  productRouter.use("/", function(request, response){
    response.send("Список товаров");
  });
  // сопотавляем роутер с конечной точкой "/products"
app.use("/products", productRouter);
app.post("/user", jsonParser, function (request, response) {
    console.log(request.body);
    if(!request.body) return response.sendStatus(400);
    console.log(request.body);
    response.json(`${request.body.userName} - ${request.body.userAge}`);
});
  

 
app.use("/contact", function(request, response){
      
    response.render("contact", {
        title: "Мои контакты",
        emailsVisible: true,
        emails: ["gavgav@mycorp.com", "mioaw@mycorp.com"],
        phone: "+1234567890"
    });
}); 

app.get("/", function(request, response){
	
	response.render("home.hbs", { 
		fruit: [ "apple", "lemon", "banana", "grape"]
	});
});

app.listen(3000);