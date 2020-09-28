/* ----------- email validation --------------- */
function ValidateEmail(emailInput) {
    var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (emailInput.value.match(mailformat)) {
        alert("Thanks for entering an email address!");
        // document.form1.text1.focus();
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
/* read text files - prob use aws congito actually */

// AWS.config.update({
//     region: "us-east-2",
//     endpoint: "dynamodb.us-east-2.amazonaws.com",
//     accessKeyId: "",
//     secretAccessKey: ""
//  });

AWS.config.region = 'us-east-2';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-2:6a244cf2-21b7-424e-a58e-9cb80202e6a4',
});
AWS.config.credentials.get(function() {
    // Credentials will be available when this function is called.
    var accessKeyId = AWS.config.credentials.accessKeyId;
    // debugger;
    var secretAccessKey = AWS.config.credentials.secretAccessKey;
    var sessionToken = AWS.config.credentials.sessionToken;
});

var dynamoDB = new AWS.DynamoDB();

/* create, read, delete item in db */
function getURL (){
    var theUrl = new URL(window.location.href); //return the current url
    // return theUrl
    return theUrl.searchParams.get("location"); //return value of location SQ
}

var docClient = new AWS.DynamoDB.DocumentClient();

function createItem(email_text) {
    var location = getURL();
    var params = {
        TableName: "User-Data",
        Item: {
            "Location": location,
            "Date": dateTime,
            "Email": email_text
        }
    };
    docClient.put(params, function (err, data) {
        if (err) {
            document.getElementById('textarea').innerHTML = "Unable to add item: " + "\n" + JSON.stringify(err, undefined, 2);
        } else {
            document.getElementById('textarea').innerHTML = "Put Item succeeded";
        }
    });
}

function reporterDetails(email_text) {
    document.getElementById('textarea').innerHTML += "Querying for items in database." + "\n";
    // debugger;
    var params = {
        TableName : "User-Data",
        KeyConditionExpression: "#reporter = :reporter_email",
        ExpressionAttributeNames: {
            "#reporter": "Email",
            // "#reportDate": "Date"
            // "#theLocation": "Location"
        },
        ExpressionAttributeValues: {
            ":reporter_email":email_text,
            // ":report_time":dateTime
        }
    };

    docClient.query(params, function(err, data) {
        if (err) {
            document.getElementById('textarea').innerHTML += JSON.stringify(err, undefined, 2);
        } else {
            // document.getElementById('textarea').innerHTML += JSON.stringify(data, undefined, 2);
            var reporter = data.Items;
            // debugger;
            scanDB(reporter);
        }
    });
}

function scanDB(reporter) {
    for (var x in reporter) {
        var myEmail = reporter[x].Email;
        var myLocation = reporter[x].Location;
        var myTime = reporter[x].Date;
        var email_list = [];
        document.getElementById('textarea').innerHTML += "a " + myLocation + "\n";
        document.getElementById('textarea').innerHTML += "a " + myTime + "\n";

        var params = {
            TableName : "User-Data",
            ProjectionExpression:"Email, #theDate, #theLocation",
            FilterExpression: "Email <> :reporter_email AND #theLocation = :reporter_location AND #theDate BETWEEN  :reporter_time_start AND :reporter_time_end",
            ExpressionAttributeNames:{
                "#theDate": "Date",
                "#theLocation": "Location"
            },
            ExpressionAttributeValues: {
                ":reporter_email": myEmail,
                ":reporter_location": myLocation,
                ":reporter_time_start": myTime,
                ":reporter_time_end": myTime + 7200000
            }
        };
        docClient.scan(params, onScan);

        // console.log(params)

        function onScan(err, data) {
            if (err) {
                document.getElementById('textarea').innerHTML += "Unable to scan the table: " + "\n" + JSON.stringify(err, undefined, 2);
            } else {
                // do something - email
                console.log(data)
                document.getElementById('textarea').innerHTML += "Scan succeeded. " + "\n";
            
                data.Items.forEach(email_contacts);
                    
                function email_contacts(json_item) {
                    let location = json_item.Location;
                    let date = json_item.Date;
                    let email = json_item.Email;
                    document.getElementById('textarea').innerHTML += email + "\n";
                    document.getElementById('textarea').innerHTML += date + "\n";
                    document.getElementById('textarea').innerHTML += location + "\n" + "\n";
                    // email_list.push(email, location, date);
                    email_body = "Hello, there was a reported case of COVID19 at " + location + " this case occured during " + date.toString();
                    console.log(email_body)
                    Email.send({
                        SecureToken: "9715427a-09aa-4965-8d4d-f5e7e686071f",
                        Host: "smtp.gmail.com",
                        Username: "salefinder.ned@gmail.com",
                        Password: "haruc4h9",
                        To: "ericdong97@gmail.com", //todo change this
                        From: "salefinder.ned@gmail.com",
                        Subject: "COVID19 Contact Tracing",
                        Body: email_body

                    }).then(
                        // message => alert("Email sent successfully")
                        console.log("email sent")
                    )
                };
    
                // Continue scanning if we have more movies (per scan 1MB limitation)
                // document.getElementById('textarea').innerHTML += "Scanning for more..." + "\n";
                // params.ExclusiveStartKey = data.LastEvaluatedKey;
                // docClient.scan(params, onScan);            
            }
        }

    }
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