
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require('path');
const cors = require('cors');
const mongo = require('./model/mongo.js');

app.use(cors());

var PORT = 80;

app.set('port', PORT);

app.use(express.static(path.join(__dirname, 'public')));

mongo.connect(function() {
  server.listen(PORT, function listening() {
    console.log('Web server listening on port %d', server.address().port);
  });
});

require('./controller/routes.js')(app);
