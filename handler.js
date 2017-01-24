'use strict';

var generator = require('./src/generator.js');
var doc = require('dynamodb-doc');
const dynamo = new doc.DynamoDB();

module.exports.hello = (event, context, callback) => {
  var g = generator();

  g.generate('https://www.g2crowd.com/', 'https://www.g2crowd.com/assets/application-a35d1c74d0adc707da369edc320411eb.css', function (err, output) {
    dynamo.putItem({ controllerAction: 'controller#action', content: output, generatedAt: new Date() });
  });

  const response = { statusCode: 201 };
  callback(null, { message: response, event });

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
