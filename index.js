import express from "express";
import cors from "cors";
import compression from "compression";
import router from "./controllers/router";
import compressBasedOnRequestHeaders from "./controllers/compressor";
import { APP_PORT_NO } from "./helpers/feed-constants";

const server = express();

server.use(cors());
server.use(
  compression({
    filter: compressBasedOnRequestHeaders
  })
);

server.use("/feeds", router);

const PORT = process.env.PORT || APP_PORT_NO;
server.listen(PORT, () => {
  console.log(
    `Server beating 💓 on PORT ${PORT} in ${process.env.NODE_ENV} environment`
  );
});
