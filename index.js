const {res, req, response} = require("express");
var fs = require("fs");
require("dotenv").config();
var express = require("express");
var app = express();
var bodyParser= require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("./public"));
app.set("view engine", "ejs");
var axios = require("axios");
var data;

// Axios for Homepage aka Bitcoin
axios.get("https://api.coinranking.com/v2/coin/Qwsogvtv82FCd/price")
    .then(res => {
        data = JSON.parse(res.data.data.price);
});


// Homepage aka Bitcoin
app.get('/', function(req, res){
    res.render("pages/home", {
        data: data
    });
});

// NY Times books
app.get('/api', function(req, res){

    // NY Times API have limited amount the amount of calls > constantly refreshing will crash 
    getData();

    var data = require(__dirname +'/public/books.json');
    var results = "";

    for (var i = 0; i < data.length; i++){
        results +=
        '<tr>' +
        '<td>' + [i+1] + '</td>' +
        '<td>' + data[i].title + '</td>' +
        '<td>' + data[i].author + '</td>' +
        '<td>' + data[i].publisher + '</td>' +
        '</tr>'
    };

    // Axios
    res.render("pages/api", {
        results : results
    });
    
    // 
    function getData() {
        axios.get("https://api.nytimes.com/svc/books/v3/lists/current/science.json?api-key=AhMc4SArycKhpVefQNrL9TVmGST54qgd")
        .then(res => {
        var data1 = res.data.results;
        var data2 = data1;
        var books = [];

        // Default amount of results is 10
        for (var i=0; i < 10; i++){

            const title = data2.books[i].title;
            const author = data2.books[i].author;
            const publisher = data2.books[i].publisher;

            var book = {
                title: title,
                author: author,
                publisher: publisher
            };

            books.push(book);
        };

            fs.writeFile(__dirname +'/public/books.json', JSON.stringify(books, null, 2), (err) => {
                if (err) throw err;
            });
        });
    };
});

// Error message
app.get('*', function(req, res){
    res.send('Cant find the requested page', 404);
});

// Listen port 3000
app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });
