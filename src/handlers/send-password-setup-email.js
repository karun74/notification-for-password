var aws = require("aws-sdk");
var sns = new aws.SNS();
aws.config.update({region: 'us-east-2'});
exports.handler = (event, context, callback) => {
console.log("Inside handler...");


console.log("aws configuration done");

console.log(event.Records.length);
 let email = '';

event.Records.forEach((record) => {
if(record.eventName == 'INSERT'){
  email = JSON.stringify(record.dynamodb.NewImage.email.S).replace(/[""]/g, "");
  console.log(email);

  var  params = {
  Protocol: 'EMAIL',
  TopicArn: 'arn:aws:sns:us-east-2:013112455320:customerCommunicationChannel', 
  Endpoint: email
  };

// Create promise and SNS service object
  var subscribePromise = new aws.SNS({apiVersion: '2010-03-31'}).subscribe(params).promise();


  subscribePromise.then(
    function(data) {
      console.log("Subscription ARN is " + data.SubscriptionArn);
    }).catch(
      function(err) {
      console.error(err, err.stack);
    });


  var params = {
                Subject: 'Congratulations! You have successfully Registered at Consulting Hub Plarform (CHP)',
                Message: 'Hi \n You have successfully registered at CHP "Consulting Hub Platform". Please set password for username (email) using the link: <a href="https://www.google.com/">Reset</a>  . \n Regards \n Director \n UniGenious Software Inc. \n Frisco, TX.',
                TopicArn: 'arn:aws:sns:us-east-2:013112455320:customerCommunicationChannel'
            };
         
             
            sns.publish(params, function(err, data) {
                if (err) {
                    console.error("Unable to send message. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    console.log("Results from sending message: ", JSON.stringify(data, null, 2));
                }
            });

}
});

}
