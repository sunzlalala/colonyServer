var http = require('http');
var url = require('url');
var Wss = require('ws').Server;
var fs = require('fs');
var Ship = require('./ship.js');
var Star = require("./star.js");

var mimetype = {
    'txt': 'text/plain',
    'html': 'text/html',
    'css': 'text/css',
    'xml': 'application/xml',
    'json': 'application/json',
    'js': 'application/javascript',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'png': 'image/png',
    'svg': 'image/svg+xml'
};

var wsport = 8888,
    httpport = 8000;


var server = http.createServer(function (req, res) {
    var pathname = url.parse(req.url).pathname;
    console.log(pathname);
    if (pathname == '/') pathname = "/index.html";
    var realPath = __dirname + '/www' + pathname;
    fs.exists(realPath, function (exists) {
        if (!exists) {
            res.writeHead(404, {
                'Content-Type': 'text/html'
            });
            res.write('<!doctype html>\n');
            res.write('<title>404 Not Found</title>\n');
            res.write('<h1>Not Found</h1>');
            res.write('<p>The requested URL ' + pathname + ' was not found on this server.</p>');
            res.end();
        } else {
            fs.readFile(realPath, "binary", function (err, file) {
                if (err) {
                    res.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    res.end(err);
                } else {
                    var contentType = mimetype[realPath.split('.').pop()] || "text/plain";
                    res.writeHead(200, {
                        'Content-Type': contentType
                    });
                    res.write(file, "binary");
                    res.end();
                }
            });
        }
    });
});
server.listen(httpport);
console.log("Server is running at " + httpport);

var clients = [];
var data = {};
var admin;

var wss = new Wss({
    port: wsport
});

wss.broadcast = function broadcast(msg) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === client.OPEN && typeof client.id != "undefined") {
            client.send(msg);
        }
    });
};

wss.on('connection', function (ws) {
    console.log('connected ,' + (clients.length + 1) + " clients now");
    ws.on('message', function (message) {
        if (message == "ping") {
            ws.send("pong");
            return;
        }
        console.log("received a message:\n" + message);
        try {
            msg = JSON.parse(message);
            if (msg.type == "login") {
                ws.id = msg.id;
                ws.uuid = msg.uuid;
                if (ws.id == "admin") {
                    if (admin) {
                        ws.send(JSON.stringify({
                            type: "exit",
                            reason: "administrator is existent"
                        }));
                    }else{
                        admin=ws;
                        ws.isadmin=true;
                        return;
                    }
                }
                var repeatId = false;
                for (var i = 0; !repeatId && i < clients.length; i++) {
                    if (clients[i] && clients[i].id == ws.id) {
                        repeatId = true;
                        if (ws.uuid == clients[i].uuid) {
                            clients[i] = ws;
                        } else {
                            ws.send(JSON.stringify({
                                type: "exit",
                                reason: "You have the same id with another user"
                            }));
                        }
                    }
                }
                if (!repeatId) {
                    ws.camp = clients.length + 1;
                    ws.send(JSON.stringify({
                        type: "camp",
                        camp: ws.camp
                    }));
                    clients.push(ws);
                }
                return;
            }
            if (msg.type == "mapUpload") {
                data.map = msg.map;
                data.maxCamp = msg.map.length;
                wss.broadcast(JSON.stringify({
                    type: "mapload",
                    map: msg.map
                }));
            }
        } catch (e) {
            console.log(e);
            console.log(message);
        }
    });
});