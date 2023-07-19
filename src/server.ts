import * as http from 'http';
import app from "./config/app";
import dataSource from "./config/database.config";
import env from "./config/env";
import webSocket from "./config/webSocket";



dataSource
    .initialize()
    .then(async () => {

        const httpServer = http.createServer(app);
        webSocket.initialize(httpServer);
        httpServer.listen(env.PORT);
        console.log(`Server is running on port ${env.PORT}`);

    })
    .catch((err) => {
        console.log(err);
    });
