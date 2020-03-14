const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {
    const params = {
        Bucket: 'my-habits',
        Key: createFileKey(event.user),
    };
    
    let previouslyPerformedHabits = [];
    
    try {
        const bucketContent = await s3.getObject(params).promise();
        previouslyPerformedHabits = JSON.parse(bucketContent.Body.toString('ascii'));
    } catch(err) {
        console.log('error when trying to read S3 bucket', err);
        return {
            statusCode: 500,
            body: 'Failed to read obj because,' + JSON.stringify(err),    
        };
    }
    
    const performedHabits = [
        ...previouslyPerformedHabits,
        event.performedHabit
    ];
    
    params.Body = JSON.stringify(performedHabits);
    
    console.log('all the performed habits', params.Body);
    
    try {
        await s3.putObject(params).promise();
        return {
            statusCode: 200,
            body: performedHabits,
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
