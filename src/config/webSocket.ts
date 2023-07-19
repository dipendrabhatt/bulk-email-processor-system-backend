import * as http from 'http';
import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';

class WebSocketServer {
    private server: Server;

    public get(): Server {
        return this.server;
    }
    public initialize(server: http.Server) {
        this.server = new Server(server, { cors: { origin: "*" } });
        this.initializeAuthentication()
        this.listen();
        return this.server;

    }
    public listen() {

        this.server.on("connection", (socket) => {
            const token = socket.handshake.auth.token;
            const data = jwt.verify(token, process.env.TOKEN_SECRET as string) as any;
            socket.join(data.id);
            socket.to(data.id).emit("message", "Welcome to the server");
        });

    }
    private initializeAuthentication() {
        this.server.use((socket, next) => {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error("Authentication error"));
            }
            jwt.verify(token, process.env.TOKEN_SECRET as string, (err: any, decoded: any) => {
                if (err) {
                    return next(new Error('Authentication error: invalid token'));
                }
                next();
            });
        });
    }
}

export default new WebSocketServer();