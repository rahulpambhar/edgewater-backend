import { Server, Socket } from "socket.io";
import http from "http";
import WebSocket from "ws";

// setup websocket server
async function setupWebSocket(server: http.Server) {

    // setup socket handlers
    const io = new Server(server, {
        cors: {
            origin: '*',
        }
    });

    io.on('connection', (socket: Socket) => {

        let ws = new WebSocket('wss://ws-feed.pro.coinbase.com');

        ws.on('open', () => {
            console.log('WebSocket connection opened to Coinbase.');
        });

        // setup subscription
        socket.on('subscribe', (message) => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    type: message.type,
                    channels: message?.channels,
                }), (error) => {
                    if (error) {
                        socket.emit('error-response', {
                            message: 'Subscription goes wrong',
                        });
                    }
                    if (!error) {
                        socket.emit('success-response', {
                            message: 'Subscription successful',
                        });
                    }
                });
            } else {
                socket.emit('error-response', {
                    message: 'WebSocket is not open yet. Queuing the subscription.',
                });
            }
        });

        // setup unsubscribe
        socket.on('unsubscribe', (message) => {

            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    type: message.type,
                    channels: message?.channels,
                }), (error) => {
                    if (error) {
                        socket.emit('error-response', {
                            message: 'UnSubscription goes wrong',
                        });
                    }
                    if (!error) {
                        socket.emit('success-response', {
                            message: 'UnSubscription successful',
                        });
                    }
                });

            } else {
                socket.emit('error-response', {
                    message: 'Product unSubscription goes wrong',
                });
            }
        });

        // setup ticker
        if (ws) {
            ws.onmessage = (event: any) => {
                const data = JSON.parse(event.data);
                if (data.type === "ticker") {
                    socket.emit('ticker', data, (error: any) => {
                        console.log(error);
                    });
                }
            };
        }

        socket.on('disconnect', async () => {
            console.log("websocket disconnected..");
        })
    });
}

export default setupWebSocket;