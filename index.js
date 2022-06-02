#!/usr/bin/env node

import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import helmet from "helmet";
import "dotenv/config";
import axios from "axios";

const app = express().use(bodyParser.json());

app.use(morgan("combined"));
app.use(helmet());

const port = process.env.PORT || 1337;
app.listen(port, () => console.log(`webhook is listening at port ${port}`));

app.post("/webhook", ({ body }, res) => {
  // Checks this is an event from a page subscription
  if (body.object === "page") {
    // Logs all message in the batch
    body.entry.forEach((entry) => {
      // entry.messaging is an array of one element only.
      const event = entry.messaging[0];
      console.log(event);
    });

    axios
      .get(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          params: {
            chat_id: process.env.CHAT_ID,
            text: "Inbox 📪",
          },
        }
      )
      .catch((error) => {
        console.log(error);
      });

    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
});

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  // If provided token matches our verify token, respond with the provided challenge token
  if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});
