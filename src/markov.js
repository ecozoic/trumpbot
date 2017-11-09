const RiTa = require('rita');

// increase this number to make the markov chain more strict (adhere more closely to source)
const rm = new RiTa.RiMarkov(3);

const removeMentions = word => !word.startsWith('@');
const removeUrls = word => !word.match(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi);

const parseTweet = tweet =>
    tweet.replace(/\&amp\;/gi, '&')
        .split(' ')
        .filter(removeMentions)
        .filter(removeUrls)
        .join(' ')
        .replace(/\s+/gi, ' ')

const genTweet = () => {
    const tweet = rm.generateSentences(3).join(' ');

    if (tweet.length > 140) {
        return genTweet();
    }

    return tweet;
}

const feedTweets = tweets => {
    rm.loadText(tweets.map(parseTweet).join(' '));
}

module.exports = {
    genTweet,
    feedTweets,
}