/* tslint:disable:ordered-imports */
import './config';
import { Twitter } from 'twit';
import { AggroBot } from './bot/AggroBot';
import AggroApiClient from './client/AggroApiClient';
import { buildTweetUrl } from './utils/tweet';
import Logger from './services/Logger';

const bot = new AggroBot({
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET
});

(async () => {
  bot
    .listenMentions()
    .on('tweet', async (tweet: Twitter.Status) => {
      if (tweet.in_reply_to_status_id_str) {
        const repliedTo = await bot.getTweet(tweet.in_reply_to_status_id_str);
        const requestedBy = `@${tweet.user.screen_name}`;
        if (repliedTo.extended_entities && repliedTo.extended_entities.media && repliedTo.extended_entities.media.length > 0) {
          const repliedToUrl = buildTweetUrl(repliedTo.user.screen_name, repliedTo.id_str);
          const replyUrl = buildTweetUrl(tweet.user.screen_name, tweet.id_str);
          const duplicates = await AggroApiClient.get('/video/requests', {
            tweet_url: repliedToUrl
          });

          Logger.info(`${requestedBy} made a new video request for tweet "${repliedToUrl}"`);

          if (duplicates.length === 0) {
            Logger.info(`No video request found for tweet "${repliedToUrl}". Adding a new video request...`);
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
            if (videoRequest.processed) {
              Logger.info('The video request was correctly processed and has a download link.');
              Logger.info(videoRequest._href.download);
            } else {
              Logger.warn(`
            The video request was not correctly processed. Maybe an async job has failed. 
            Please check your failed queue and retry failed jobs
            `);
            }
          }
        } else {
          Logger.warn(`${requestedBy} tried to call me on a tweet with no videos...`);
        }
      }
    });
})();
