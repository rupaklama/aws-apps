// note: 'services' dir hosts Lambda Functions

// basic lambda function to deploy using cdk
exports.main = async function (event, context) {
  return {
    // note: in order for this lambda to be executed by Api Gateway,
    // it needs to return statusCode & body in the json format
    statusCode: 200,
    body: JSON.stringify(`Hello! I will read from ${process.env.TABLE_NAME}`),
  };
};
