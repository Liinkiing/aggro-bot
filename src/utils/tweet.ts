import { List } from '../utils/extensions';

export const buildTweetUrl = (screenName: string, tweetId: string) =>
  `https://twitter.com/${screenName}/status/${tweetId}`

export const NEW_REQUEST_TWEET_MESSAGES = new List<string>([
  `T'inquiètes pas, je m'occupe de tout chef 👌`,
  `Moi on m'appelle je débarque tout de suite, comme un vrai khey. Je te renverrai un message quand j'aurai téléchargé ta douce vidéo.`,
  `Ah mec tu m'aggro comme ça sur ce genre de vidéos mamène, je ne peux que te faire plaiz' et la DL pour toi 🙌`,
  `👀 👀 👀`,
])

export const NO_VIDEO_TWEET_MESSAGES = new List<string>([
  `Heu... ? T'es au courant que y a pas de vidéos sur ce tweet issou ? Après c'est peut être ma faute et j'ai pas su traiter ta vidéo, dans ce cas déso khey 😢`,
  `T'as cru que jpouvais télécharger du texte ? Enfin si c'est possible mais j'sers pas à ça frère, tu t'es trompé sur la personne`,
])

export const ALREADY_AVAILABLE_VIDEO_TWEET_MESSAGES = (downloadUrl: string) => new List<string>([
  `Mais non jui éclaté au sol, j'avais déjà cette vidéo, toi tu dois être un mec drôle du coup. Tiens le lien kheyou : ${downloadUrl}`,
  `Gotta go fast comme Sahnic : ⚡ ${downloadUrl} ⚡`,
])
