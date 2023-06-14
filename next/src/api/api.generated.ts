/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disabled no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  CustomAxiosResponse,
  CustomPromise,
  IBEError,
  IRequestService,
  formatUrl,
  requestService,
} from 'swagger-to-typescript2'
import { ENV } from '../env'

const API_SERVER_URL =
  process.env.NODE_ENV === 'development' ? ENV.LOCAL : ENV.REMOTE_NGINX

// DON'T REMOVE THIS COMMENTS!!! Code between comments auto-generated
// INSERT START
export enum ERezkaVideoType {
  film = 'film',
  cartoon = 'cartoon',
}
export interface IActorResponse {
  id: string
  name: string
  photo_url: string
}
export interface IPostActorBody {
  name: string
  photo_url: string
}
export interface IPutActorBody {
  name: string
  photo_url: string
}
export interface IGroupMovieDetailedResponse {
  imdb_info: IImdbResponse
  rezka_movie_href: string
  actors: IRezkaMovieActorDto[]
}
export interface IImdbResponse {
  id: string
  en_name: string
  ua_name?: string
  poster: string
  imdb_rating: number
  year: number
  jsonObj: IImdbResultResponse
}
export interface IImdbResultResponse {
  Title: string
  Year: string
  Rated: string
  Released: string
  Runtime: string
  Genre: string
  Director: string
  Writer: string
  Actors: string
  Plot: string
  Language: string
  Country: string
  Awards: string
  Poster: string
  Ratings: IImdbRating[]
  Metascore: string
  imdbRating: string
  imdbVotes: string
  imdbID: string
  Type: string
  DVD: string
  BoxOffice: string
  Production: string
  Website: string
  Response: string
}
export interface IImdbRating {
  Source: string
  Value: string
}
export interface IRezkaMovieActorDto {
  rezka_movie_id: string
  actor_id: string
  is_director: boolean
  is_actor: boolean
  is_writer: boolean
}
export interface IGroupMovieResponse {
  rate: number
  year: number
  genre: string
  name: string
  ua_name: string
  imdb_id: string
  has_ua?: boolean
  has_en?: boolean
  has_kubik?: boolean
  poster: string
  video_type: ERezkaVideoType
}
export interface IPutImdbBody {
  en_name: string
  ua_name?: string
  poster: string
  imdb_rating: number
  year: number
  jsonObj: IImdbResultResponse
  json: string
}
export interface IPostImdbBody {
  id: string
  en_name: string
  ua_name?: string
  poster: string
  imdb_rating: number
  year: number
  jsonObj: IImdbResultResponse
  json: string
}
export interface ISearchImdbBody {
  enName: string
  year: string
  id?: string
}
export interface IError {
  message: string
  code: string
}
export interface ISearchUANameImdbBody {
  id?: string
}
export interface ICypressStreamBody {
  href: string
}
export interface IVideoInfoResult {
  en_name: string
  year: number
  url: string
  imdb_rezka_relative_link: string
  translations: ITranslation[]
}
export interface ITranslation {
  resolutions: IResolutionItem[]
  translation: string
  data_translator_id: string
  data_camrip: string
  data_ads: string
  data_director: string
  encoded_video_url: string
}
export interface IResolutionItem {
  resolution: string
  streams: string[]
}
export interface IRezkaInfoResponse {
  url_id: string
  id_attr: string
  href: string
  year: number
}
export interface IRezkaMovieResponse {
  id: string
  en_name: string
  year: number
  href: string
  video_type: ERezkaVideoType
  rezka_imdb_id: string
}
export interface IRezkaDetailsBody {
  imdb_id: string
}
export interface IRezkaInfoByIdResponse {
  translation_id: string
  translation_name: string
  cdn_encoded_video_url: string
}
export interface IPostRezkaMovieBody {
  en_name: string
  year: number
  href: string
  video_type: ERezkaVideoType
  rezka_imdb_id: string
}
export interface IPutRezkaMovieBody {
  en_name: string
  year: number
  href: string
  video_type: ERezkaVideoType
  rezka_imdb_id: string
}
export interface ISearchRezkaMovieResponse {
  href: string
  rezka_imdb_id: string
  id: string
}
export interface IRezkaMovieTranslationResponse {
  rezka_movie_id: string
  translation_id: string
  data_ads: number
  data_camrip: number
  data_director: number
}
export interface ISetupBody {
  searchImdb: boolean
  updateImdbUaName: boolean
  updateRezkaCartoon: boolean
  updateRezkaFilm: boolean
  updateRezkaImdbId: boolean
  updateRezkaTranslations: boolean
  addActorsFromMovieDb: boolean
  uploadActorPhotoToCdn: boolean
}
export interface ITranslationResponse {
  id: string
  label: string
}
export interface IPostTranslationBody {
  id: string
  label: string
}
export interface IPutTranslationBody {
  label: string
}
export type TActorIdGetError = '' | 'undefined'
export type TActorIdDeleteError = '' | 'undefined'
export type TActorIdPutError = '' | 'undefined'
export type TActorGetError = '' | 'undefined'
export type TActorPostError = '' | 'undefined'
export type TCdnIdGetError = '' | 'undefined'
export type TCdnIdHasFileGetError = '' | 'undefined'
export type TCdnUploadPostError = '' | 'undefined'
export type TGroupMovieIdGetError = '' | 'undefined'
export type TGroupMovieV2GetError = '' | 'undefined'
export type TGroupMovieGetError = '' | 'undefined'
export type TImdbIdDeleteError = '' | 'undefined'
export type TImdbIdGetError = '' | 'undefined'
export type TImdbIdPutError = '' | 'undefined'
export type TImdbGetError = '' | 'undefined'
export type TImdbPostError = '' | 'undefined'
export type TImdbSearchPostError = '' | 'undefined'
export type TImdbSearchUaNamePostError = '' | 'undefined'
export type TParserCypressImdbPostError = '' | 'undefined'
export type TParserCypressStreamsPostError = '' | 'undefined'
export type TParserRezkaAllPostError = '' | 'undefined'
export type TRezkaMovieGetError = '' | 'undefined'
export type TRezkaMoviePostError = '' | 'undefined'
export type TParserRezkaDetailsPostError = '' | 'undefined'
export type TRezkaMovieIdDeleteError = '' | 'undefined'
export type TRezkaMovieIdGetError = '' | 'undefined'
export type TRezkaMovieIdPutError = '' | 'undefined'
export type TRezkaMovieSearchRezkaWithoutStreamGetError = '' | 'undefined'
export type TRezkaMovieTranslationGetError = '' | 'undefined'
export type TToolsImageSearchPostError = '' | 'undefined'
export type TToolsSetupPostError = '' | 'undefined'
export type TTranslationIdDeleteError = '' | 'undefined'
export type TTranslationIdGetError = '' | 'undefined'
export type TTranslationIdPutError = '' | 'undefined'
export type TTranslationGetError = '' | 'undefined'
export type TTranslationPostError = '' | 'undefined'
export type TPartialErrorCodes =
  | TActorIdGetError
  | TActorIdDeleteError
  | TActorIdPutError
  | TActorGetError
  | TActorPostError
  | TCdnIdGetError
  | TCdnIdHasFileGetError
  | TCdnUploadPostError
  | TGroupMovieIdGetError
  | TGroupMovieV2GetError
  | TGroupMovieGetError
  | TImdbIdDeleteError
  | TImdbIdGetError
  | TImdbIdPutError
  | TImdbGetError
  | TImdbPostError
  | TImdbSearchPostError
  | TImdbSearchUaNamePostError
  | TParserCypressImdbPostError
  | TParserCypressStreamsPostError
  | TParserRezkaAllPostError
  | TRezkaMovieGetError
  | TRezkaMoviePostError
  | TParserRezkaDetailsPostError
  | TRezkaMovieIdDeleteError
  | TRezkaMovieIdGetError
  | TRezkaMovieIdPutError
  | TRezkaMovieSearchRezkaWithoutStreamGetError
  | TRezkaMovieTranslationGetError
  | TToolsImageSearchPostError
  | TToolsSetupPostError
  | TTranslationIdDeleteError
  | TTranslationIdGetError
  | TTranslationIdPutError
  | TTranslationGetError
  | TTranslationPostError
  | ''

export const createApiRequest = (rs: IRequestService) => ({
  actorIdGet: (
    id: string,
  ): CustomPromise<
    CustomAxiosResponse<IActorResponse, TActorIdGetError>,
    IBEError<TActorIdGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/actor/${id}`)),

  actorIdDelete: (
    id: string,
  ): CustomPromise<
    CustomAxiosResponse<Array<IActorResponse>, TActorIdDeleteError>,
    IBEError<TActorIdDeleteError>
  > => rs.delete(formatUrl(API_SERVER_URL + `api/actor/${id}`)),

  actorIdPut: (
    id: string,
    body: IPutActorBody,
  ): CustomPromise<
    CustomAxiosResponse<IActorResponse, TActorIdPutError>,
    IBEError<TActorIdPutError>
  > => rs.put(formatUrl(API_SERVER_URL + `api/actor/${id}`), body),

  actorGet: (
    query:
      | { actor_name?: string; movie_id?: string; imdb_id?: string }
      | undefined,
  ): CustomPromise<
    CustomAxiosResponse<Array<IActorResponse>, TActorGetError>,
    IBEError<TActorGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/actor/`, query)),

  actorPost: (
    body: IPostActorBody,
  ): CustomPromise<
    CustomAxiosResponse<Array<IActorResponse>, TActorPostError>,
    IBEError<TActorPostError>
  > => rs.post(formatUrl(API_SERVER_URL + `api/actor/`), body),

  cdnIdGet: (
    id: string,
  ): CustomPromise<
    CustomAxiosResponse<Blob, TCdnIdGetError>,
    IBEError<TCdnIdGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/cdn/${id}`)),

  cdnIdHasFileGet: (
    id: string,
  ): CustomPromise<
    CustomAxiosResponse<void, TCdnIdHasFileGetError>,
    IBEError<TCdnIdHasFileGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/cdn/${id}hasFile/`)),

  cdnUploadPost: (): CustomPromise<
    CustomAxiosResponse<void, TCdnUploadPostError>,
    IBEError<TCdnUploadPostError>
  > => rs.post(formatUrl(API_SERVER_URL + `api/cdn/upload/`)),

  groupMovieIdGet: (
    id: string,
  ): CustomPromise<
    CustomAxiosResponse<IGroupMovieDetailedResponse, TGroupMovieIdGetError>,
    IBEError<TGroupMovieIdGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/group-movie/${id}`)),

  groupMovieV2Get: (
    query:
      | { imdb_id?: string; actor_id?: string; actor_name?: string }
      | undefined,
  ): CustomPromise<
    CustomAxiosResponse<Array<IGroupMovieResponse>, TGroupMovieV2GetError>,
    IBEError<TGroupMovieV2GetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/group-movie-v2/`, query)),

  groupMovieGet: (): CustomPromise<
    CustomAxiosResponse<Array<IGroupMovieResponse>, TGroupMovieGetError>,
    IBEError<TGroupMovieGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/group-movie/`)),

  imdbIdDelete: (
    id: string,
  ): CustomPromise<
    CustomAxiosResponse<IImdbResponse, TImdbIdDeleteError>,
    IBEError<TImdbIdDeleteError>
  > => rs.delete(formatUrl(API_SERVER_URL + `api/imdb/${id}`)),

  imdbIdGet: (
    id: string,
  ): CustomPromise<
    CustomAxiosResponse<IImdbResponse, TImdbIdGetError>,
    IBEError<TImdbIdGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/imdb/${id}`)),

  imdbIdPut: (
    id: string,
    body: IPutImdbBody,
  ): CustomPromise<
    CustomAxiosResponse<IImdbResponse, TImdbIdPutError>,
    IBEError<TImdbIdPutError>
  > => rs.put(formatUrl(API_SERVER_URL + `api/imdb/${id}`), body),

  imdbGet: (
    query: { page?: number; limit?: number } | undefined,
  ): CustomPromise<
    CustomAxiosResponse<Array<IImdbResponse>, TImdbGetError>,
    IBEError<TImdbGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/imdb/`, query)),

  imdbPost: (
    body: IPostImdbBody,
  ): CustomPromise<
    CustomAxiosResponse<IImdbResponse, TImdbPostError>,
    IBEError<TImdbPostError>
  > => rs.post(formatUrl(API_SERVER_URL + `api/imdb/`), body),

  imdbSearchPost: (
    body: ISearchImdbBody,
  ): CustomPromise<
    CustomAxiosResponse<IImdbResultResponse, TImdbSearchPostError>,
    IBEError<TImdbSearchPostError>
  > => rs.post(formatUrl(API_SERVER_URL + `api/imdb/search/`), body),

  imdbSearchUaNamePost: (
    body: ISearchUANameImdbBody,
  ): CustomPromise<
    CustomAxiosResponse<IImdbResultResponse, TImdbSearchUaNamePostError>,
    IBEError<TImdbSearchUaNamePostError>
  > => rs.post(formatUrl(API_SERVER_URL + `api/imdb/search_ua_name/`), body),

  parserCypressImdbPost: (
    query: { page?: number; limit?: number } | undefined,
  ): CustomPromise<
    CustomAxiosResponse<string, TParserCypressImdbPostError>,
    IBEError<TParserCypressImdbPostError>
  > => rs.post(formatUrl(API_SERVER_URL + `api/parser/cypress-imdb/`, query)),

  parserCypressStreamsPost: (
    body: ICypressStreamBody,
    query: { page?: number; limit?: number } | undefined,
  ): CustomPromise<
    CustomAxiosResponse<IVideoInfoResult, TParserCypressStreamsPostError>,
    IBEError<TParserCypressStreamsPostError>
  > =>
    rs.post(
      formatUrl(API_SERVER_URL + `api/parser/cypress-streams/`, query),
      body,
    ),

  parserRezkaAllPost: (
    query: { type?: ERezkaVideoType } | undefined,
  ): CustomPromise<
    CustomAxiosResponse<Array<IRezkaInfoResponse>, TParserRezkaAllPostError>,
    IBEError<TParserRezkaAllPostError>
  > => rs.post(formatUrl(API_SERVER_URL + `api/parser/rezka-all/`, query)),

  rezkaMovieGet: (
    query: { imdb_id?: string } | undefined,
  ): CustomPromise<
    CustomAxiosResponse<Array<IRezkaMovieResponse>, TRezkaMovieGetError>,
    IBEError<TRezkaMovieGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/rezka-movie/`, query)),

  rezkaMoviePost: (
    body: IPostRezkaMovieBody,
  ): CustomPromise<
    CustomAxiosResponse<Array<IRezkaMovieResponse>, TRezkaMoviePostError>,
    IBEError<TRezkaMoviePostError>
  > => rs.post(formatUrl(API_SERVER_URL + `api/rezka-movie/`), body),

  parserRezkaDetailsPost: (
    body: IRezkaDetailsBody,
  ): CustomPromise<
    CustomAxiosResponse<
      Array<IRezkaInfoByIdResponse>,
      TParserRezkaDetailsPostError
    >,
    IBEError<TParserRezkaDetailsPostError>
  > => rs.post(formatUrl(API_SERVER_URL + `api/parser/rezka-details/`), body),

  rezkaMovieIdDelete: (
    id: string,
  ): CustomPromise<
    CustomAxiosResponse<Array<IRezkaMovieResponse>, TRezkaMovieIdDeleteError>,
    IBEError<TRezkaMovieIdDeleteError>
  > => rs.delete(formatUrl(API_SERVER_URL + `api/rezka-movie/${id}`)),

  rezkaMovieIdGet: (
    id: string,
  ): CustomPromise<
    CustomAxiosResponse<IRezkaMovieResponse, TRezkaMovieIdGetError>,
    IBEError<TRezkaMovieIdGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/rezka-movie/${id}`)),

  rezkaMovieIdPut: (
    id: string,
    body: IPutRezkaMovieBody,
  ): CustomPromise<
    CustomAxiosResponse<IRezkaMovieResponse, TRezkaMovieIdPutError>,
    IBEError<TRezkaMovieIdPutError>
  > => rs.put(formatUrl(API_SERVER_URL + `api/rezka-movie/${id}`), body),

  rezkaMovieSearchRezkaWithoutStreamGet: (
    query: { page?: number; limit?: number } | undefined,
  ): CustomPromise<
    CustomAxiosResponse<
      Array<ISearchRezkaMovieResponse>,
      TRezkaMovieSearchRezkaWithoutStreamGetError
    >,
    IBEError<TRezkaMovieSearchRezkaWithoutStreamGetError>
  > =>
    rs.get(
      formatUrl(
        API_SERVER_URL + `api/rezka-movie/search-rezka-without-stream/`,
        query,
      ),
    ),

  rezkaMovieTranslationGet: (
    query: { rezka_movie_id?: string; translation_id?: string } | undefined,
  ): CustomPromise<
    CustomAxiosResponse<
      Array<IRezkaMovieTranslationResponse>,
      TRezkaMovieTranslationGetError
    >,
    IBEError<TRezkaMovieTranslationGetError>
  > =>
    rs.get(formatUrl(API_SERVER_URL + `api/rezka-movie-translation/`, query)),

  toolsImageSearchPost: (): CustomPromise<
    CustomAxiosResponse<string[], TToolsImageSearchPostError>,
    IBEError<TToolsImageSearchPostError>
  > => rs.post(formatUrl(API_SERVER_URL + `api/tools/image_search/`)),

  toolsSetupPost: (
    body: ISetupBody,
  ): CustomPromise<
    CustomAxiosResponse<string[], TToolsSetupPostError>,
    IBEError<TToolsSetupPostError>
  > => rs.post(formatUrl(API_SERVER_URL + `api/tools/setup/`), body),

  translationIdDelete: (
    id: string,
  ): CustomPromise<
    CustomAxiosResponse<Array<ITranslationResponse>, TTranslationIdDeleteError>,
    IBEError<TTranslationIdDeleteError>
  > => rs.delete(formatUrl(API_SERVER_URL + `api/translation/${id}`)),

  translationIdGet: (
    id: string,
  ): CustomPromise<
    CustomAxiosResponse<ITranslationResponse, TTranslationIdGetError>,
    IBEError<TTranslationIdGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/translation/${id}`)),

  translationIdPut: (
    id: string,
    body: IPutTranslationBody,
  ): CustomPromise<
    CustomAxiosResponse<ITranslationResponse, TTranslationIdPutError>,
    IBEError<TTranslationIdPutError>
  > => rs.put(formatUrl(API_SERVER_URL + `api/translation/${id}`), body),

  translationGet: (
    query: { imdb_id?: string } | undefined,
  ): CustomPromise<
    CustomAxiosResponse<Array<ITranslationResponse>, TTranslationGetError>,
    IBEError<TTranslationGetError>
  > => rs.get(formatUrl(API_SERVER_URL + `api/translation/`, query)),

  translationPost: (
    body: IPostTranslationBody,
  ): CustomPromise<
    CustomAxiosResponse<Array<ITranslationResponse>, TTranslationPostError>,
    IBEError<TTranslationPostError>
  > => rs.post(formatUrl(API_SERVER_URL + `api/translation/`), body),
})

const URL = {
  actorIdGet: (id: string): string => `api/actor/${id}`,
  actorIdDelete: (id: string): string => `api/actor/${id}`,
  actorIdPut: (id: string): string => `api/actor/${id}`,
  actorGet: (): string => `api/actor/`,
  actorPost: (): string => `api/actor/`,
  cdnIdGet: (id: string): string => `api/cdn/${id}`,
  cdnIdHasFileGet: (id: string): string => `api/cdn/${id}hasFile/`,
  cdnUploadPost: (): string => `api/cdn/upload/`,
  groupMovieIdGet: (id: string): string => `api/group-movie/${id}`,
  groupMovieV2Get: (): string => `api/group-movie-v2/`,
  groupMovieGet: (): string => `api/group-movie/`,
  imdbIdDelete: (id: string): string => `api/imdb/${id}`,
  imdbIdGet: (id: string): string => `api/imdb/${id}`,
  imdbIdPut: (id: string): string => `api/imdb/${id}`,
  imdbGet: (): string => `api/imdb/`,
  imdbPost: (): string => `api/imdb/`,
  imdbSearchPost: (): string => `api/imdb/search/`,
  imdbSearchUaNamePost: (): string => `api/imdb/search_ua_name/`,
  parserCypressImdbPost: (): string => `api/parser/cypress-imdb/`,
  parserCypressStreamsPost: (): string => `api/parser/cypress-streams/`,
  parserRezkaAllPost: (): string => `api/parser/rezka-all/`,
  rezkaMovieGet: (): string => `api/rezka-movie/`,
  rezkaMoviePost: (): string => `api/rezka-movie/`,
  parserRezkaDetailsPost: (): string => `api/parser/rezka-details/`,
  rezkaMovieIdDelete: (id: string): string => `api/rezka-movie/${id}`,
  rezkaMovieIdGet: (id: string): string => `api/rezka-movie/${id}`,
  rezkaMovieIdPut: (id: string): string => `api/rezka-movie/${id}`,
  rezkaMovieSearchRezkaWithoutStreamGet: (): string =>
    `api/rezka-movie/search-rezka-without-stream/`,
  rezkaMovieTranslationGet: (): string => `api/rezka-movie-translation/`,
  toolsImageSearchPost: (): string => `api/tools/image_search/`,
  toolsSetupPost: (): string => `api/tools/setup/`,
  translationIdDelete: (id: string): string => `api/translation/${id}`,
  translationIdGet: (id: string): string => `api/translation/${id}`,
  translationIdPut: (id: string): string => `api/translation/${id}`,
  translationGet: (): string => `api/translation/`,
  translationPost: (): string => `api/translation/`,
}
// INSERT END
// DON'T REMOVE THIS COMMENTS!!!

export const API_URL = URL
export const api = {
  ...createApiRequest(requestService),
}
