'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.deleteCard = (event, context, callback) => {
    const params = {
        TableName: 'Cards',
        Key: {
            cardId: event.pathParameters.cardId
        }
    };

    const result = dynamoDb.delete(params, (error, data) => {
        if (!error) {
            const response = {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*"
                },
                body: JSON.stringify(result),
            };
            context.succeed(response);
        }
    });
};