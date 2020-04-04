const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {
    const initalState = [];
    
    const params = {
        Bucket: 'my-habits',
        Key: createFileKey(event.user),
        Body: JSON.stringify(initalState),
    };
    
    try {
        await s3.putObject(params).promise();
        return {
            statusCode: 200,
            body: `${event.user.name}'s bucket has been cleaned`,
        };
    } catch(err) {
        console.log('error after trying to write S3 bucket', err);
        return {
            statusCode: 500,
            body: 'Failed to write obj because,' + JSON.stringify(err),    
        };
    }
    
};

const createFileKey = (user) => {
    if (!user) {
        return 'performed-habits.json';
    }
    
    return `${user.name}/performed-habits.json`;
};
