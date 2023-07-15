import app from "./config/app";
import dataSource from "./config/database.config";
import env from "./config/env";


dataSource
    .initialize()
    .then((_) => {
        app.listen(env.PORT, () => {
            console.log(`Server is running on port ${env.PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });
