import T from 'twit';
import { AggroBotCredentials } from '../@types';
import Logger from '../services/Logger';

export class AggroBot {

  private me: T.Twitter.User | null = null
  private readonly twitter: T;

  public constructor(credentials: AggroBotCredentials) {
    const { access_token, access_token_secret, consumer_key, consumer_secret } = credentials;
    this.twitter = new T({
      access_token,
      access_token_secret,
      consumer_key,
      consumer_secret
    });
  }

  public get user(): T.Twitter.User {
    return this.me
  }

  public fetchMyself = async () => {
    this.me = (await this.twitter.get('account/verify_credentials', { skip_status: true })).data as T.Twitter.User
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
    if (!this.me) {
      Logger.error(`Associated user could not be found. Maybe you forgot to call 'fetchMyself'?`)
    }
    return this.twitter.stream('statuses/filter', {
      track: `@${this.me.screen_name}`
    })
  }
}
