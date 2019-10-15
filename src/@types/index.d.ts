export type Uuid = string

export interface AggroBotCredentials {
  consumer_key: string
  consumer_secret: string
  access_token: string
  access_token_secret: string
}

interface ApiHrefs {
  self: string,
  download: string
}

export interface AggroApiVideoRequest {
  tweetUrl: string,
  requestBy: string,
  processed: boolean,
  replyUrl: string,
  id: Uuid,
  _href: ApiHrefs
}

export interface AggroApiPostVideoRequestBody {
  tweetUrl: string,
  requestedBy: string,
  replyUrl: string
}

export interface AggroApiGetVideoRequestsQuery {
  tweet_url: string
}

export type AggroApiGetVideoRequests = AggroApiVideoRequest[]

export type AggroApiPostVideoRequest = AggroApiVideoRequest

export interface AggroApiGetResponseMap {
  "/video/requests": AggroApiGetVideoRequests,
  [key: string]: any
}

export interface AggroApiPostResponseMap {
  "/video/requests": AggroApiVideoRequest,
  [key: string]: any
}

export interface AggroApiGetQueryMap {
  "/video/requests": AggroApiGetVideoRequestsQuery,
  [key: string]: any
}

export interface AggroApiPostBodyMap {
  "/video/requests": AggroApiPostVideoRequestBody,
  [key: string]: any
}
