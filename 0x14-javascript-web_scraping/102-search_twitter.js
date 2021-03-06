#!/usr/bin/node
const request = require('request');

const auth = 'Basic ' + Buffer.from(process.argv[2] + ':' + process.argv[3]).toString('base64');

let data = {
  url: 'https://api.twitter.com/oauth2/token',
  headers: {
    Authorization: auth,
    'content-type': 'application/x-www-form-urlencoded'
  },
  body: 'grant_type=client_credentials'
};

request.post(data, (err, res, body) => {
  if (err) {
    console.log(err);
  } else {
    data = {
      url: 'https://api.twitter.com/1.1/search/tweets.json',
      headers: {
        Authorization: `Bearer ${JSON.parse(body).access_token}`
      },
      qs: {
        q: process.argv[4],
        result_type: 'recent',
        count: 5
      }
    };
    request.get(data, (err, res, body) => {
      if (err) {
        console.log(err);
      } else {
        const tweets = JSON.parse(body);
        for (const tweet of tweets.statuses) {
          console.log(`[${tweet.id}] ${tweet.text} by ${tweet.user.name}`);
        }
      }
    });
  }
}
);
