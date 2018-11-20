const env = process.env.NODE_ENV;
if (env !== 'production') {
     require('dotenv').config(); //eslint-disable-line
}

if (!process.env.MONGO_STRING) {
    throw new Error('No MONGO_STRING present in the system');
}

const isTestEnv = env === 'test';
const port = isTestEnv
    ? process.env.TEST_PORT
    : process.env.PORT;
const mongoUrl = isTestEnv
    ? process.env.TEST_MONGO_STRING
    : process.env.MONGO_STRING;

if (!mongoUrl) {
    throw new Error('No MONGO_STRING present in the system');
}

if (!port) {
    throw new Error('No PORT present in the system');
}

module.exports = {
    port,
    mongoUrl,
};
