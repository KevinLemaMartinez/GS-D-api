'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const responseHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',  
    'Access-Control-Allow-Credentials': true
};

exports.getCards = (event, context, callback) => {
    getCards(event, (error, result) => {
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
                body: JSON.stringify(error)
            };
            
        }
        callback(error, response);
    });
};

function getCards(event, callback) {

    var userId = event.requestContext.authorizer.jwt.claims.sub;

    const params = {
        TableName: 'Cards',
        IndexName: 'tagIndex',
        ExpressionAttributeNames: {
            "#userId": "userId"
        },
        ExpressionAttributeValues: {
            ":userId": userId
        },
        KeyConditionExpression: "#userId = :userId",
    };

    dynamoDb.query(params, function (error, data) {
        if (error) {
            callback(error);
        }
        callback(error, data.Items);
    });
}