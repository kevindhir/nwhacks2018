/**
 * Created by kevindhir on 2018-01-13.
 */
import uuid from "uuid";
import AWS from "aws-sdk";

AWS.config.update({ region: "us-east-2" });
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export function main(event, context, callback) {
    // Request body is passed in as a JSON encoded string in 'event.body'
    const data = JSON.parse(event.body);

    const params = {
        TableName: "posts",
        Item: {
            postId: uuid.v1(),
            userId: event.requestContext.identity.cognitoIdentityId,
            category: data.category,
            body: data.body,
            title: data.title,
            createdAt: new Date().getTime()
        }
    };

    dynamoDb.put(params, (error, data) => {
        // Set response headers to enable CORS (Cross-Origin Resource Sharing)
        const headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true
        };

    // Return status code 500 on error
    if (error) {
        const response = {
            statusCode: 500,
            headers: headers,
            body: JSON.stringify({ status: false })
        };
        callback(null, response);
        return;
    }

    // Return status code 200 and the newly created item
    const response = {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify(params.Item)
    };
    callback(null, response);
});
}