/*
 * Primary file
 *
 */

 //Dependencies
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');
var wMssgLib = require('./lib/welcomeMssg');


//Instantiating the http srrver
var httpServer = http.createServer(function(req,res){
	//Get the URL and parse it
	var parsedUrl = url.parse(req.url,true);

	//Send the path
	var path = parsedUrl.pathname;
	var trimmedPath = path.replace(/^\/+|\/+$/g,'');

	//Get the payloads, if any
	var decoder = new StringDecoder('utf-8');
	var buffer = '';
	req.on('data',function(data){
		buffer += decoder.write(data);
	});
	req.on('end',function(){
		buffer += decoder.end();

	//choose handler this request should go to . If one is not found, use the notFound handler
	var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

	// Contruct the data onject to send to the handler
	var data = {
		'trimmedPath' : trimmedPath,
		'payload' : buffer
	};

	// Route the request to the handler specified in the router
	chosenHandler(data,function(statusCode,payload){


	//Use the statusCode called back by the handler, or default handler
	statusCode = typeof(statusCode) == 'number' ? statusCode: 200;

	//Use the payload called back by the handler, or default to
	payload = typeof(payload) == 'object' ? payload : {};

	//Convert the payload to a string
	var payloadString = JSON.stringify(payload);

	//Return the response
	res.setHeader('Content-Type','application/json');
	res.writeHead(statusCode);
	res.end(payloadString);

	//Log the request path
	console.log('returning this response: ',statusCode,payload);
	});
});

});

//Start the server
httpServer.listen(config.httpPort,function(){
	console.log("The server is listening on port "+config.httpPort+" in "+config.envName+" mode");
});

// App object
var app = {};

// Get all the jokes
 var allmssg = wMssgLib.allmssg();

 //Declare i = 0
 var i = 0;

//Create a loop function that print 5 welcome messages sequentially after every second
app.myLoop = function() {           
   setTimeout(function () {    
      console.log(allmssg[i]);          
      i++;                     
      if (i < 5) {            
         app.myLoop();             
      }                       
   }, 2000)
}

//Define handlers
var handlers ={};

//Not found handler
handlers.notFound = function(data,callback){
	callback(404);
};

//ping handler
handlers.hello = function(data,callback){
	//callback a http status code, and a payload object
	callback(200,{'message': app.myLoop()});
};

//Define a request router
var router = {
	'hello' : handlers.hello
};








