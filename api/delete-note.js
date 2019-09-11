/**
 * Route: DELETE /note/t/{timestamp}
 */

const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-west-1' });

const util = require('./util.js')

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;

exports.handler = async (event) => {
    try {
        let timestamp = parseInt(event.pathParameters.timestamp);
        let params = {
            TableName: tableName,
            Key: {
                user_id: util.getUserId(eventHeaders),
                timestamp: timestamp
            }
        };

        await dynamoDB.delete(params).promise();
        return {
            statusCode: 200,
            headers: util.getResponseHeaders(),
        }
    } catch (err) {
        console.log("Error", err);
        return {
            statusCode: err.statusCode ? err.statusCode : 500,
            headers: util.getResponseHeaders(),
            body: JSON.stringify({
                error: err.name ? err.name : "Exception",
                message: err.message ? err.message : "Unknown error"
            })
        }
    }
}