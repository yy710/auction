function setWss(wss) {
  wss.on('connection', function (socket, req) {
    // [debug]
    console.log('client ip: ', req.connection.remoteAddress);
    console.log('client token: ', req.headers.token);
    console.log('app token: ', req.headers.apptoken);

    // say hello
    const data = { msg: 'hello' };
    socket.send(JSON.stringify(data));

    socket.on('message', function (msg) {
      console.log('received msg: ', msg);
    });

    socket.on('close', function () {
      console.log('socket closed!');
    });
  });

  wss.broadcast = function (data) {
    console.log('broadcast: ', data);
    wss.clients.forEach((client) => {
      // SocketServer: { CONNECTING: 0, OPEN: 1, CLOSING: 2, CLOSED: 3 }
      if (client.readyState === 1) {
        client.send(JSON.stringify(data));
      }
    });
  };

  return wss;
}

module.exports = setWss;
