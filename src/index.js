require('dotenv').config();
const _ = require('lodash');

process.stdin.resume();
process.stdin.setEncoding('utf8');

const getTweets = require('./tweets');
const { genTweet, feedTweets } = require('./markov');

const twitterHandles = ['realDonaldTrump'];

Promise.all(
    twitterHandles.map(getTweets)
).then(feeds => {
    feedTweets(_.flatten(feeds));

    console.log('Enter any key to generate a tweet. Enter "quit" to quit');
    process.stdin.on('data', (text) => {
        if (text === 'quit\r\n' || text === 'quit\n') {
            process.exit();
        } else {
            console.log(genTweet());
        }
    });
});