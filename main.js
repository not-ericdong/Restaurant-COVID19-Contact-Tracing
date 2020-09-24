/* ----------- email validation --------------- */
function ValidateEmail(emailInput)
{

    var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (emailInput.value.match(mailformat)) {
        alert("Thanks for entering an email address!");
        document.form1.text1.focus();
        return (true);
    } else {
        // let errorMsgP = document.createElement("div");
        // let errorMsg = document.createTextNode("You have entered an invalid email address!");
        // errorMsgP.appendChild(errorMsg);
        // let currentDiv = document.getElementById("button1");
        // document.body.insertBefore(errorMsgP, currentDiv);
        alert("Please enter a valid email address!");
        document.form1.text1.focus();
        return (false);
    }
}

/* Date time stuff */
var d = new Date(); //current time
var dateTime = d.getTime();
// 2hr = 7200000ms

/* -----------------aws dynamoDB-------------------- */
/* read text files */



AWS.config.update({
    region: "us-east-2",
    endpoint: "dynamodb.us-east-2.amazonaws.com",
    accessKeyId: "",
    secretAccessKey: ""
 });

var dynamoDB = new AWS.DynamoDB();

/* create, read, delete item in db */

var docClient = new AWS.DynamoDB.DocumentClient();

function createItem(email_text, location) {
   var params = {
       TableName :"User-Data",
       Item:{
            "Email": email_text,
            "Date": dateTime,
            "Location": location,
       }
   };
   docClient.put(params, function(err, data) {
       if (err) {
           document.getElementById('textarea').innerHTML = "Unable to add item: " + "\n" + JSON.stringify(err, undefined, 2);
       } else {
           document.getElementById('textarea').innerHTML = "PutItem succeeded: " + "\n" + JSON.stringify(data, undefined, 2);
       }
   });
}

function readItem(email_text) {
   var table = "User-Data";
   var email = email_text;
   var date = 123;
   var info = {};


   var params = {
       TableName: table,
       Key:{
           "Email": email,
        //    "Date": date,
            "Location": "The Food Place"
       }
   };
   docClient.get(params, function(err, data) {
       if (err) {
           document.getElementById('textarea').innerHTML = "Unable to read item: " + "\n" + JSON.stringify(err, undefined, 2);
       } else {
           document.getElementById('textarea').innerHTML = "GetItem succeeded: " + "\n" + JSON.stringify(data, undefined, 2);
       }
   });
}

function conditionalDelete(email_text) {
   var table = "User-Data";
   var email = email_text;
   var date = 2020;

   var params = {
       TableName:table,
       Key:{
           "year":year,
           "title":title
       },
       ConditionExpression:"info.rating <= :val",
       ExpressionAttributeValues: {
           ":val": 5.0
       }
   };

   docClient.delete(params, function(err, data) {
       if (err) {
           document.getElementById('textarea').innerHTML = "The conditional delete failed: " + "\n" + JSON.stringify(err, undefined, 2);
       } else {
           document.getElementById('textarea').innerHTML = "The conditional delete succeeded: " + "\n" + JSON.stringify(data, undefined, 2);
       }
   });
}