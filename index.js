const express = require("express");
const client = require("prom-client"); // Metrics collection

const { doSomeHeavyTask } = require("./util");

const collectDefaultMetrics = client.collectDefaultMetrics;

collectDefaultMetrics({
  register: client.register,
});

const app = express();

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

