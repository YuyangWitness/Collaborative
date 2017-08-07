const express = require('express');
const mongoose = require('mongoose');
const http = require("http");

const app = express();
const restRouter = require("./routes/rest.js");
const indexRouter = require("./routes/index.js");
const editorSocketService = require("./services/editorSocketService.js");
const path = require("path");

mongoose.connect('mongodb://root:root@ds163612.mlab.com:63612/bittiger503');

app.use(express.static(path.join(__dirname, '../public/')));

app.use("/", indexRouter);

app.use("/api/v1", restRouter);

app.use(function(req, res){
  res.sendFile('index.html', {root: path.join(__dirname, '../public/')})
});

// app.listen(3000, function () {
//   console.log('Example app listening on port 3000!');
// });


const server = http.createServer(app);
const io = require("socket.io")(server);

editorSocketService(io);
server.listen(3000);

server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
  throw error;
}

function onListening() {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + address.port;
  console.log('Listening on ' + bind);
}