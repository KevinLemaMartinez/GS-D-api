'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const uuid = require('uuid');
const responseHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true
};

exports.postCard = (event, context, callback) => {
  postCard(event, (error, result) => {
    var response;
    if (!error) {
      response = {
        statusCode: 200,
        headers: responseHeaders,
        body: JSON.stringify(result)
      };
    } else {
      response = {
        statusCode: 500,
        headers: responseHeaders,
        body: JSON.stringify(result)
      };
    }
    callback(error, response);
  });
};

function postCard(event, callback) {

  var data = JSON.parse(event.body);
  data.userId = event.requestContext.authorizer.jwt.claims.sub;

  if (data.cardId == null) {
    var cardOrder = getLastCardOrder(data.userId);
    if (cardOrder == null) {
      cardOrder = 0;
    } else {
      cardOrder++;
    }
    data.cardOrder = cardOrder;
    data.cardId = cardOrder + '_' + uuid.v4();
  }

  if (data.creationTimestamp == null) {
    data.creationTimestamp = Date.now();
  }

  insertCard(data, (error, result) => {
    callback(error, result);
  });
}

function getLastCardOrder(userId) {
  const params = {
    TableName: 'Cards',
    ExpressionAttributeNames: {
      "#userId": "userId"
    },
    ExpressionAttributeValues: {
      ":userId": userId
    },
    KeyConditionExpression: "#userId = :userId",
    Limit: 1,
    ScanIndexForward: false
  };

  var cardOrder;
  dynamoDb.query(params, function (error, data) {
    if (error) {
      console.log(error);
    } else {
      if (data.Items != null) {
        cardOrder = data.Items[0].order;
      }
    }
  });
  return cardOrder;
}

function insertCard(data, callback) {
  const params = {
    TableName: 'Cards',
    Item: addDerivatedFields(data)
  };

  dynamoDb.put(params, (error, data) => {
    if (error) {
      callback(error);
    }
    callback(error, params.Item);
  });
}

function addDerivatedFields(data) {
  var dynamoDBCardItem = data;
  dynamoDBCardItem.creationTimestamp_cardId = data.creationTimestamp + '_' + data.cardId;

  if (typeof data.fixed === "undefined") {
    dynamoDBCardItem.fixed_creationTimestamp_tag = '1_' + data.creationTimestamp + '_';
  } else {
    dynamoDBCardItem.fixed_creationTimestamp_tag = '0_' + data.creationTimestamp + '_';
  }

  if (typeof data.tag != "undefined") {
    dynamoDBCardItem.fixed_creationTimestamp_tag = dynamoDBCardItem.fixed_creationTimestamp_tag + data.tag;
  }

  return dynamoDBCardItem;
}