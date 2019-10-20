/* tslint:disable:ordered-imports */
import './config';
import { Twitter } from 'twit';
import { AggroBot } from './bot/AggroBot';
import AggroApiClient from './client/AggroApiClient';
import {
  ALREADY_AVAILABLE_VIDEO_TWEET_MESSAGES,
  buildTweetUrl,
  NEW_REQUEST_TWEET_MESSAGES,
  NO_VIDEO_TWEET_MESSAGES, OWN_TWEET_MESSAGES
} from './utils/tweet';
import Logger from './services/Logger';

const bot = new AggroBot({
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET
});

const execute = async () => {
  await bot.fetchMyself()
  bot
    .listenMentions()
    .on('tweet', async (tweet: Twitter.Status) => {
      if (tweet.in_reply_to_status_id_str) {
        const repliedTo = await bot.getTweet(tweet.in_reply_to_status_id_str);
        const requestedBy = `@${tweet.user.screen_name}`;
        if (repliedTo.user.screen_name === bot.user.screen_name) {
          Logger.warn(`${requestedBy} tried to summon me on my own tweet...`)
          await bot.replyToTweet(tweet.id_str, OWN_TWEET_MESSAGES.random())
        }
        else if (repliedTo.extended_entities && repliedTo.extended_entities.media && repliedTo.extended_entities.media.length > 0) {
          const repliedToUrl = buildTweetUrl(repliedTo.user.screen_name, repliedTo.id_str);
          const replyUrl = buildTweetUrl(tweet.user.screen_name, tweet.id_str);
          const duplicates = await AggroApiClient.get('/video/requests', {
            tweet_url: repliedToUrl
          });

          Logger.info(`${requestedBy} made a new video request for tweet "${repliedToUrl}"`);

          if (duplicates.length === 0) {
            Logger.info(`No video request found for tweet "${repliedToUrl}". Adding a new video request...`);
            await bot.replyToTweet(tweet.id_str, NEW_REQUEST_TWEET_MESSAGES.random());
            try {
              await AggroApiClient.post('/video/requests', {
                replyUrl,
                requestedBy,
                tweetUrl: repliedToUrl
              });
              Logger.success('Successfully added the video request.');
            } catch (e) {
              Logger.error('Could not add the video request.', e);
            }
          } else {
            Logger.info(`An existing video request was found for tweet "${repliedToUrl}".`);
            const videoRequest = { ...duplicates[0] };
            if (videoRequest.processed && videoRequest.video) {
              Logger.info('The video request was correctly processed and has a download link.');
              Logger.info(videoRequest.video._href.download);
              await bot.replyToTweet(tweet.id_str, ALREADY_AVAILABLE_VIDEO_TWEET_MESSAGES(videoRequest.video._href.download).random());
            } else {
              Logger.warn(`
          The video request was not correctly processed. Maybe an async job has failed. 
          Please check your failed queue and retry failed jobs
          `);
            }
          }
        } else {
          Logger.warn(`${requestedBy} tried to call me on a tweet with no videos...`);
          await bot.replyToTweet(tweet.id_str, NO_VIDEO_TWEET_MESSAGES.random());
        }
      }
    });

  setInterval(() => {
    Logger.info('Bot is listenning for mentions');
  }, 20000);
}

execute();
