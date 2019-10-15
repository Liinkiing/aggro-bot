/* tslint:disable:ordered-imports */
import './config';
import { Twitter } from 'twit';
import { AggroBot } from './bot/AggroBot';
import AggroApiClient from './client/AggroApiClient';

const bot = new AggroBot({
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
});

(async () => {
  bot
    .listenMentions()
    .on('tweet', async (tweet: Twitter.Status) => {
      if (tweet.in_reply_to_status_id_str) {
        // const repliedTo = await bot.getTweet(tweet.in_reply_to_status_id_str)
        const response = await AggroApiClient.get('/video/requests')
        console.log(response);
      }
    })
})()
