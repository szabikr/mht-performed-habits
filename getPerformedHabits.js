
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {
    
    const userName = event.queryStringParameters.user;

    const params = {
        Bucket: 'my-habits',
        Key: `${userName}/performed-habits.json`
    };
    
    try {
        const performedHabits = await s3.getObject(params).promise();
        
        // TODO: Turn this into a javascript object from string
        const responseBody = performedHabits.Body.toString('ascii');
        
        return {
            statusCode: 200,
            body: responseBody,
        };
    } catch(err) {
        return {
            statusCode: 500,
            body: 'Failed to read the bucket',
        }
    }
};
