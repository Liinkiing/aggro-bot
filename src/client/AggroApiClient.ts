import {
  AggroApiGetQueryMap,
  AggroApiGetResponseMap,
  AggroApiPostBodyMap,
  AggroApiPostResponseMap
} from '@/@types';
import fetch, { Request } from 'node-fetch';
import querystring from 'querystring'

const AUTH_HEADER = 'X-AUTH-TOKEN';

class AppAggroApiClient {

  constructor(
    private readonly baseUri: string,
    private readonly token: string
  ) {}

  public get = async <K extends keyof AggroApiGetResponseMap>(endpoint: K, query?: AggroApiGetQueryMap[K]): Promise<AggroApiGetResponseMap[K]> => {
    const request = new Request(
      `${this.baseUri}${endpoint}` +
      (query ? '?' + querystring.stringify(query) : '')
    );
    this.prepare(request);

    return (await fetch(request)).json();
  };

  public post = async <K extends keyof AggroApiPostResponseMap>(endpoint: K, body: AggroApiPostBodyMap[K], query?: any) => {
    const request = new Request(
      `${this.baseUri}${endpoint}` +
      (query ? '?' + querystring.stringify(query) : ''),
      { method: 'POST', body: JSON.stringify(body) }
    );
    this.prepare(request);

    return (await fetch(request)).json();
  };

  private prepare = (request: Request): this => {
    request.headers.set('Accept', 'application/json');
    request.headers.set('Content-Type', 'application/json');
    this.auth(request);

    return this;
  };

  private auth = (request: Request) => {
    request.headers.set(AUTH_HEADER, this.token);
  };
}

const AggroApiClient = new AppAggroApiClient(
  process.env.API_URL,
  process.env.API_TOKEN,
)

export default AggroApiClient;


