var http = require('http'); // 1 - Import Node.js core module

var server = http.createServer(function (req, res) {   // 2 - creating server

    //handle incomming requests here..
 	     if (req.url === '/api/userAuth') { //check the URL of the current request
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({ message: "Hello World"}));  
            res.end();  
    		}  

});

let ec=server.listen(5000); //3 - listen for any incoming requests

console.log('Node.js web server at port 5000 is running..')