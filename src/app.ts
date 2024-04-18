import express from "express";
import { userRouter, productRouter, categoriesRouter } from "./routes";
import bodyParser from "body-parser";
const app = express();
app.use(bodyParser());
app.use(bodyParser.json());
app.use(express.json());

// added router for api endpoint
let prefixApi = "/api/v1";
app.use(`${prefixApi}/users`, userRouter);
app.use(`${prefixApi}/products`, productRouter);
app.use(`${prefixApi}/categories`, categoriesRouter);

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
