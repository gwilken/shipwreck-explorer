
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const http = require('http');
const server = http.createServer(app);
const path = require('path');
const cors = require('cors');
const mongo = require('./model/mongo.js');

app.use(cors());

var PORT = 8002;

app.set('port', PORT);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type: "application/vnd.api+json"}));

app.use(express.static(path.join(__dirname, 'public')));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

mongo.connect(function() {
  server.listen(PORT, function listening() {
    console.log('Web server listening on port %d', server.address().port);
  });
});

require('./controller/routes.js')(app);
