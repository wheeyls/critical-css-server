'use strict';

var generator = require('./src/generator.js');
var aws = require('aws-sdk');
const dynamo = new aws.DynamoDB.DocumentClient();

module.exports.hello = (event, context, callback) => {
  var g = generator();
  var params = event.queryStringParameters;
  callback(null, { statusCode: 200, body: JSON.stringify({ message: 'done', input: event }) });

  g.generate('https://www.g2crowd.com/', 'https://www.g2crowd.com/assets/application-a35d1c74d0adc707da369edc320411eb.css', function (err, output) {
    dynamo.put({ TableName: 'generated-css', Item: { controllerAction: 'controller#action', content: output, generatedAt: new Date() } }, function (err) {
      if (err) { throw err; }
    });
  });
};
