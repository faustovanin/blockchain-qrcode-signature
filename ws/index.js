
var Web3 = require("web3");
var web3 = new Web3();
var http = require('http');

const WebSocket = require('ws');
const ws = new WebSocket.Server({port: 3001});

const env = process.argv[2];
var provider = '';
var host = '';

if(env == 'dev') {
	provider = 'ws://127.0.0.1:8545';
	host = 'localhost';
}
else if(env == 'test') {
	provider = 'ws://127.0.0.1:8546';
	host = 'localhost';
}
else {
	provider = 'ws://172.18.0.23:8500';
	host = '172.18.0.25';
}

const fs = require('fs');

const contractJson = JSON.parse(fs.readFileSync('../build/contracts/NFe.json', 'utf8'));

var topics = [
	web3.utils.sha3('NFeSigned(bytes32,bytes,address)'),
];

const getTopic = function(value) {
	switch(value) {
		case topics[0]:
			return 'signed'
		default:
			return 'error'
	}
}

ws.on('connection', function(s) {
	console.log('New client connected');
	s.on('error', function(error) {
		console.log('WS Error: ' + error);
	});
});

ws.broadcast = function(data) {
	console.log('Message to broadcast');
	console.log(data);
	console.log(ws.clients);
	ws.clients.forEach(function (client) {
		if(client.readyState === WebSocket.OPEN) {
			client.send(data);
		}
	});
}

ws.on('error', function(error) {
	console.log('WS Error: ' + error);
});

http.createServer(function (req, res) {
 	// res.write(JSON.stringify({'pendingTransactions': pendingTransactions})); //write a response to the client
 	// res.end(); //end the response
}).listen(3000, host, () => {
	console.log("Server up and running");
	web3.setProvider(new web3.providers.WebsocketProvider(provider, {
	  headers: {
	    Origin: "http://"+host
	  }
	}));
	web3.eth.net.isListening()
		.then(() => {
			console.log('Connected to ' + provider);
			web3.eth.subscribe('logs', {
			    topics: topics
			  }, (error, result) => {
				['NFeSigned'].forEach( topic => {
					const eventJsonInterface = web3.utils._.find(
					    contractJson.abi,
					    o => o.name === topic && o.type === 'event',
					);
					console.log(eventJsonInterface);
				    if (!error && eventJsonInterface) {
				    	const eventObj = web3.eth.abi.decodeLog(
							eventJsonInterface.inputs,
							result.data,
							result.topics.slice(1)
						);
					    console.log(`New ${topic}!`, eventObj);
					    eventObj.topic = topic;
					    ws.broadcast(JSON.stringify(eventObj));
				    }
				})
			  })
		})
		.catch(e => console.log('Unable to connect to ' + provider));
})