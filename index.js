const express = require("express");
var bodyParser = require("body-parser");
const app = express();
const Nexmo = require("nexmo");
const cors = require("cors");
const path = require("path");
// path.join(__dirname, "private.key");
const nexmo = new Nexmo({
  apiKey: '2910d4dd',
  apiSecret: 'rT5pgwc8WJhnIZX8',
  applicationId: 'cd3e608e-0cf6-46e0-ae35-822f1ad2b93c',
  privateKey: path.join(__dirname, "jwtRS256.key")
});

app.use(cors());
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  return res.send("GET HTTP method on user resource");
});
app.post("/users", (req, res) => {
  return res.send("POST HTTP method on user resource");
});
app.post("/send_verify_code", (req, res) => {
  let phone_number = req.body.callingCode + req.body.phoneNumber;
  console.log("27", phone_number);
  nexmo.verify.request(
    {
      number: phone_number,
      brand: "Net Giver"
    },
    (err, result) => {
      console.log("34", err, result);
      if (err) {
        return res.status(500).json({ error: err });
      } else {
        let verifyRequestId = result.request_id;
        console.log(verifyRequestId);
        return res.send(verifyRequestId);
      }
    }
  );
});
app.post("/inbound-message", (req, res) => {
  console.log("inbound-message", req.body);
  res.status(200).end();
});
app.post("/message-status", (req, res) => {
  console.log("message-status", req.body);
  res.status(200).end();
});
app.get("/ccc", () => {
  const message = {
    content: {
      type: "text",
      text: "Welcome to Net Giver"
    }
  };
  nexmo.channel.send(
    { type: "sms", number: "660844848584" },
    { type: "sms", number: "660844848584" },
    {
      content: {
        type: "text",
        text: "This is an SMS sent from the Messages API"
      }
    },
    (err, data) => {
      console.log(err);
    }
  );
});
app.put("/check_verify_code", (req, res) => {
  //   console.log(req.body);
  let phone_number = req.body.callingCode + req.body.phoneNumber;
  let verifyRequestId = req.body.verfication_id;
  let code = req.body.code;
  console.log(phone_number);
  nexmo.verify.check(
    {
      request_id: verifyRequestId,
      code: code
    },
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      } else {
        const message = {
          content: {
            type: "text",
            text: "Welcome to Net Giver"
          }
        };
        nexmo.channel.send(
          { type: "sms", number: phone_number },
          { type: "sms", number: "Net Giver" },
          message,
          (err, data) => {
            console.log("85", err);
          },
          { useBasicAuth: true }
        );
        return res.send(result);
      }
    }
  );
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
