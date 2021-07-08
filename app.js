//***************We need to use the express, body-parser, https, request module methods and use require method for that***************
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const request = require("request");

//***************Calling express method to initialize the express framework***************
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

//***************We need to setup the home url for your port, __dirname returns the root directory in which your file is present***************
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html")
})


//***************after the landing page opens, user will enter data in the respective columns, we are grabbing that data and posting it in mailchimp servers using their API***************
app.post("/", function(req, res) {

  // **************whatever you enter in the data fields of the home page, we are using bodyparser method req.body and storing it in constants*************
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  //***************We are placing the above data in javascript object***************
  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }

    }]
  }

  //***************Converting data which is a javascript object into flatpack json object***************
  const jsonData = JSON.stringify(data);

  //***************making https request to post the json data onto mailchimp servers https( url, options,function(response){} ) and saving that in const request************

  //necessary attributes for https( url, options,function(response){} )
  const url = "https://us6.api.mailchimp.com/3.0/lists/4f47aee85c"
  const options = {
    method: "POST",
    auth: "bmt:2a6ce778ad0a8c11182966f88f4c6a30-us6"
  }
  //making a request and when we get back a response we check "on" that data, using json.parse to parse it into json
  const request = https.request(url, options, function(response) {
//***************if you successfully hit the url and got response, then use the http response and send a success/failure message***************
    if(response.statusCode===200)
    res.sendFile(__dirname + "/success.html");
    else
    res.sendFile(__dirname + "/failure.html");

    response.on("data", function(data) {
      console.log("success"); //JSON.parse(data)"");

    })


  })

  //***************now we have to pass the "data" as json object to the mailchimp server using request.write method***************
  //request.write(jsonData);
  request.end(); //now end the request
})

//***************after the failure page opens, when the user clicks the try again button it should lead to the home page again***************
app.post("/failure", function(req, res) {
  res.redirect("/")
})



//***************Your server needs to listen for the homepage URL. app.listen method listens at port 3000***************
app.listen(3000, function() {
  console.log("server is up and running at port 3000");
})



// mail chimp apikey 2a6ce778ad0a8c11182966f88f4c6a30-us6

//Audience Id or list id  mail chimp 4f47aee85c
