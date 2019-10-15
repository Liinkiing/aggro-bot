import T from 'twit';
import { AggroBotCredentials } from '../@types';

export class AggroBot {

  private twitter: T;

  public constructor(credentials: AggroBotCredentials) {
    const { access_token, access_token_secret, consumer_key, consumer_secret } = credentials;
    this.twitter = new T({
      access_token,
      access_token_secret,
      consumer_key,
      consumer_secret
    });
  }

  public replyToTweet = async (tweetId: string, body: string): Promise<T.Twitter.Status> => {
     return (await this.twitter.post('statuses/update', {
         auto_populate_reply_metadata: true,
         in_reply_to_status_id: tweetId,
         status: body
       })).data as T.Twitter.Status
  }

  public getTweet = async (tweetId: string): Promise<T.Twitter.Status> => {
    return (await this.twitter.get(`statuses/show/${tweetId}`)).data as T.Twitter.Status
  }

  public listenMentions = () => {
    return this.twitter.stream('statuses/filter', {
      track: '@aggro_bot'
    })
  }
}
