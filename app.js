const express = require("express");
const bodyParser = require("body-parser");
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const emailAddress = req.body.emailAddress;
  const listId = "b16a7c38c1";
  mailchimp.setConfig({
    apiKey: "efb85712252d6f583e81ec9c6ebefe37-us18", // {APIKEY-DATACENTER(dc)}
    server: "us18", // DATACENTER(dc)
  });

  async function run() {
    try {
      const response = await mailchimp.lists.addListMember(listId, {
        email_address: emailAddress,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      });

      console.log(
        `Successfully added contact as an audience member. The contact's id is ${response.id}.`
      );
      res.sendFile(__dirname + "/success.html");
    } catch (error) {
      console.log(error);
      res.sendFile(__dirname + "/failure.html");
    }
  }
  run();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(3000);
