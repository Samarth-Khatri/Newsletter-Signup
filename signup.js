const express = require("express");
const app = express();
const request = require("request");
const https = require("https");
const {config} = require(__dirname + '/config.js'); // requiring another js file

app.use(express.urlencoded({
  extended: true
}));

app.use(express.static("public")); //Creates a folder "public" where we can access static local files

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html")
});

app.post("/", function(req, res) {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  const jsonData = JSON.stringify(data);

  var id = config.AUDIENCE_ID;   //getting api keys from private js file
  var key = config.MY_API_KEY;

  const url = "https://us5.api.mailchimp.com/3.0/lists/" + id;

  const options = {
    method: "POST",
    auth: "Samarth:" + key
  }

  const request = https.request(url, options, function(response) {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();

});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.post("/success", function(req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is up and running");
});
