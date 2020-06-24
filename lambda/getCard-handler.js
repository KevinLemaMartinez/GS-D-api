'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const responseHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true
};

module.exports.getCard = (event, context, callback) => {
  getCard(event, (error, result) => {
    var response;
    if (!error) {
      response = {
        statusCode: 200,
        headers: responseHeaders,
        body: JSON.stringify(result),
      };
    } else {
      response = {
        statusCode: 500,
        headers: responseHeaders,
        body: JSON.stringify(error),
      };
    }
    callback(error, response);
  });
};

function getCard(event, callback) {

  var userId = event.requestContext.authorizer.claims.client_id;
  var cardId = event.pathParameters.cardId;

  const params = {
    TableName: 'Cards',
    Key: {
      userId: userId,
      cardId: cardId
    }
  };

  dynamoDb.get(params, (error, data) => {
    if (error) {
      callback(error);
    }
    callback(error, data.Item);
  });
}