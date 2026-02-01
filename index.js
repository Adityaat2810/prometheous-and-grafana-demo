const express = require("express");
const client = require("prom-client"); // Metrics collection

const { doSomeHeavyTask } = require("./util");
const responseTime = require("response-time");

const collectDefaultMetrics = client.collectDefaultMetrics;

collectDefaultMetrics({
  register: client.register,
});

const reqResTime = new client.Histogram({
  name: "http_express_req_res_time_seconds",
  help: "This tell how much time is taken by req and res",
  labelNames: ["method", "route", "code"],
  buckets: [1, 50, 100, 200, 300, 400, 500, 750, 1000, 2000], // in ms
});

const totalReq = new client.Counter({
  name: "http_express_total_req_count",
  help: "Total number of requests",
  labelNames: ["method", "route", "code"],
});

const app = express();
app.use(
  responseTime((req, res, time) => {
    totalReq.inc()
    const route = req.route?.path || req.originalUrl || 'unknown';

    reqResTime
      .labels(req.method, route, res.statusCode)
      .observe(time / 1000); // ms → seconds
  })
);

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  const metrics = await client.register.metrics();

  res.send(metrics);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get('/slow', async (req, res) => {
  try {
    // Simulate a slow operation
    const timeTaken =await doSomeHeavyTask();
    res.send("This was a slow response!");

  } catch (error) {
    res.status(500).send("An error occurred!");
  }
});

let PORT = 8000;

app.listen(PORT, ()=> {
  console.log("hey");
});

