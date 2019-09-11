const AWS = require('aws-sdk');
AWS.config.update({region: 'eu-west-1'});

const moment = require('moment');
const uuidv4 = require('uuid/v4');
const util = require('./util.js');

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;

exports.handler = async(event) => {
    try{
        let item = JSON.parse(event.body).Item;
        item.user_id = util.getUserId(event.headers);
        item.user_name = util.getUserName(event.headers);
        item.note_id = item.user_id + ':' + uuidv4();
        item.timestamp = moment().unix();
        item.expires =  moment().add(90,'days').unix();

        let data = await dynamoDB.put({
            TableName: tableName,
            Item: item
        }).promise();
        return {
            statusCode: 200,
            headers: util.getResponseHeaders(),
            body: JSON.stringify(item)
        }
    } catch (err){
        console.log("Error",err);
        return{
            statusCode: err.statusCode ? err.statusCode : 500,
            headers: util.getResponseHeaders(),
            body: JSON.stringify({
                error: err.name ? err.name : "Exception",
                message : err.message ? err.message : "Unknown error"
            })
        }
    }
}