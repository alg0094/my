
const http = require("http");
const WebSocket = require("ws");

const PORT = process.env.PORT || 10000;

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({
      ok: true,
      service: "AJ WebSocket"
    }));
  }

  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("AJ WebSocket server is running.");
});

const wss = new WebSocket.Server({
  server,
  path: "/ws"
});

wss.on("connection", (socket) => {
  socket.send(JSON.stringify({
    t: "welcome",
    service: "AJ",
    mode: "test",
    message: "WebSocket connected successfully"
  }));

  socket.on("message", (raw) => {
    let message;

    try {
      message = JSON.parse(raw.toString());
    } catch {
      socket.send(JSON.stringify({
        t: "error",
        message: "Send valid JSON"
      }));
      return;
    }

    if (message.t === "ping") {
      socket.send(JSON.stringify({
        t: "pong",
        time: new Date().toISOString()
      }));
      return;
    }

    socket.send(JSON.stringify({
      t: "echo",
      received: message
    }));
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`AJ server listening on port ${PORT}`);
});
