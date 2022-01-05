import express from "express";
import compression from "compression";
import router from './controllers/router';
import compressBasedOnRequestHeaders from "./controllers/compressor";
import { APP_PORT_NO } from "./helpers/feed-constants";

const server = express();

server.use(
  compression({
    filter: compressBasedOnRequestHeaders
  })
);

server.use('/feeds', router);

server.listen(APP_PORT_NO, () => {
  console.log(`Server beating 💓 on PORT ${APP_PORT_NO} in ${process.env.NODE_ENV} environment`);
});
