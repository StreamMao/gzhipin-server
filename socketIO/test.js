
module.exports = function (server) {
  // 得到IO 对象
  const io = require("socket.io")(server, {
    cors: {
      origin: '*',
    },
  });
  // 监视连接(当有一个客户连接上时回调)
  io.on("connection", function (socket) {
    console.log("soketio connected");
    // 绑定sendMsg 监听, 接收客户端发送的消息
    socket.on("sendMsg", function (data) {
      console.log("服务器接收到浏览器的消息", data);
      //处理数据
      data.name = data.name.toUpperCase()
      // 向客户端发送消息(名称, 数据)
    //   io.emit("receiveMsg", data.name + "_" + data.date); //io发送所有连接上服务器的客户端
      socket.emit("receiveMsg", data); //socket只发送给当前socket对应的客户端
      console.log("服务器向浏览器发送消息", data);
    });
  });
};
