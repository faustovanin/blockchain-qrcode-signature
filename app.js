var express = require('express'),
  app = express(),
  port = process.env.PORT || 5000;
  bodyParser = require('body-parser');

var path = require('path');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('docs'))

var routes = require('./api/router');

routes.env = process.argv[2];
if(!routes.env) {
	console.error("ERROR: Environment not provided. Exiting...");
	process.exit(1);
}
routes.address = process.argv[3];
routes(app);

server = app.listen(port);
server.setTimeout(180000);

console.log('Blockchain RESTful API server started on: ' + port);

process.on('uncaughtException', function(err) {
	console.log('***Uncaught Exception: ' + err + '****');
})