const twit = require('twit');

const twitter = new twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

const getTweets = user => {
    const _getTweets = (user, last_id = null) => {
        const params = {
            screen_name: user,
            count: 200,
            include_rts: false,
        };

        if (last_id) {
            params.max_id = last_id;
        }

        return twitter
            .get('statuses/user_timeline', params)
            .then(response => {
                if (depth > 10) {
                    return tweets;
                }

                tweets = tweets.concat(
                    response.data
                        .filter(data => data.lang === 'en')
                        .map(data => data.text)
                );
                depth++;
                last_id = response.data[response.data.length - 1].id_str;
                return _getTweets(user, last_id);
            })
        ;
    };

    let tweets = [];
    let depth = 1;
    return _getTweets(user).then(response => tweets);
};

module.exports = getTweets;