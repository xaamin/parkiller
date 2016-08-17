var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server)
  , bodyParser = require('body-parser');

server.listen(8080);

var simulation = io.of('/simulation');

simulation.on('connection', function (socket) 
{	
	console.log('Someone connected');
	socket.emit('message', { host: 'socket.io', message: 'Working !!!' });

	socket.on('start-simulation', function (data) 
	{	
		console.log('Starting simulation');
		simulation.emit('clear-markers', data);
	});

	socket.on('position-update', function (data) 
	{	
		console.log('Position update');
		simulation.emit('marker-update', data);
	});
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/simulate', function(req, res) 
{
	simulation.emit('marker-update', { marker: { id: req.body.id || 1 } });
	res.end('Sending marker update position');
});

app.get('/refresh', function(req, res) 
{
	simulation.emit('clear-markers', { message: 'Browser window get refresh' });
	simulation.emit('start-simulation', { message: 'Starting simulation from NodeJS' });

	res.end('Sending to sockets connected');
});
