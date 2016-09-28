const http = require('http');
const fs = require('fs');
var server = http.createServer(function(request, response){
    var method = request.method;
    var url = request.url;
    var headers = request.headers;
    var body = '';
    console.log('method:' + method + '\nurl:' + url + '\nheaders:' + JSON.stringify(headers));
    request.on('error', function(err){
        console.log(err);
    });
    response.on('error', function(err){
        console.log(err);
    });
    var date = new Date();
    var userAgent = headers['user-agent'];
    fs.appendFile('requests.txt', 'Date: ' + date + ',\tMethod: ' + method + ',\tUrl: ' + url + ',\tUser Agent: ' + userAgent + '\n');
    if (method == 'GET' || method == 'HEAD'){
        response.setHeader('Content-Type', 'text/html');
        response.statusCode = 200;
    }
    if(method == 'HEAD'){
        response.end();
    }
    else if (method == 'GET' && url == '/requests.txt'){
        response.setHeader('Content-Type', 'text/plain');
        const readable = fs.createReadStream('requests.txt');
        console.log(readable);
        readable.pipe(response);
    }
    else if (method == 'GET'){
        response.write('<html>');
        response.write('<title>Hello World!</title>');
        response.write('<p>Hello World!</p>');
        response.write('</html>');
        response.end();
    }
    else if (method == 'POST'){
        response.statusCode = 302;
        response.setHeader('Location', 'http://www.google.com');
        request.on('data', function(dataChunk){
            body += dataChunk;
        }).on('end', function(){
            console.log(body);
        });
        response.end();
    }
    else{
        response.statusCode = 403;
        response.end();
    }


}).listen(8080);
