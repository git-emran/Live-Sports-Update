import express from "express";
const app = express();
app.set("trust proxy", true);
const req = {
  headers: { "x-forwarded-for": "" },
  connection: { remoteAddress: "1.2.3.4" },
  app: app
};
app.request.__proto__ = req;
console.log("req.ip:", app.request.ip);
