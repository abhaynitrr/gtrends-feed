import express from "express";
import compression from "compression";
import router from "./controllers/router";
import compressBasedOnRequestHeaders from "./controllers/compressor";
import { APP_PORT_NO } from "./helpers/feed-constants";

const server = express();

server.use(
  compression({
    filter: compressBasedOnRequestHeaders
  })
);

server.use("/feeds", router);

const port = process.env.PORT || APP_PORT_NO;
server.listen(port, () => {
  console.log(
    `Server beating 💓 on PORT ${process.env.NODE_ENV || APP_PORT_NO} in ${
      process.env.NODE_ENV
    } environment`
  );
});
