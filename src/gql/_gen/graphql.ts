/* eslint-disable */
import type { DocumentTypeDecoration } from "@graphql-typed-document-node/core";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  AnimeKindString: { input: any; output: any };
  AnimeStatusString: { input: any; output: any };
  DurationString: { input: any; output: any };
  ISO8601Date: { input: any; output: any };
  ISO8601DateTime: { input: any; output: any };
  MangaKindString: { input: any; output: any };
  MangaStatusString: { input: any; output: any };
  MylistString: { input: any; output: any };
  PositiveInt: { input: any; output: any };
  RatingString: { input: any; output: any };
  SeasonString: { input: any; output: any };
};

export type Anime = {
  __typename?: "Anime";
  airedOn?: Maybe<IncompleteDate>;
  characterRoles?: Maybe<Array<CharacterRole>>;
  chronology?: Maybe<Array<Anime>>;
  createdAt: Scalars["ISO8601DateTime"]["output"];
  description?: Maybe<Scalars["String"]["output"]>;
  descriptionHtml?: Maybe<Scalars["String"]["output"]>;
  descriptionSource?: Maybe<Scalars["String"]["output"]>;
  duration?: Maybe<Scalars["Int"]["output"]>;
  english?: Maybe<Scalars["String"]["output"]>;
  episodes: Scalars["Int"]["output"];
  episodesAired: Scalars["Int"]["output"];
  externalLinks?: Maybe<Array<ExternalLink>>;
  fandubbers: Array<Scalars["String"]["output"]>;
  fansubbers: Array<Scalars["String"]["output"]>;
  franchise?: Maybe<Scalars["String"]["output"]>;
  genres?: Maybe<Array<Genre>>;
  id: Scalars["ID"]["output"];
  isCensored?: Maybe<Scalars["Boolean"]["output"]>;
  japanese?: Maybe<Scalars["String"]["output"]>;
  kind?: Maybe<AnimeKindEnum>;
  licenseNameRu?: Maybe<Scalars["String"]["output"]>;
  licensors?: Maybe<Array<Scalars["String"]["output"]>>;
  malId?: Maybe<Scalars["ID"]["output"]>;
  name: Scalars["String"]["output"];
  nextEpisodeAt?: Maybe<Scalars["ISO8601DateTime"]["output"]>;
  personRoles?: Maybe<Array<PersonRole>>;
  poster?: Maybe<Poster>;
  rating?: Maybe<AnimeRatingEnum>;
  related?: Maybe<Array<Related>>;
  releasedOn?: Maybe<IncompleteDate>;
  russian?: Maybe<Scalars["String"]["output"]>;
  score?: Maybe<Scalars["Float"]["output"]>;
  scoresStats?: Maybe<Array<ScoreStat>>;
  screenshots: Array<Screenshot>;
  season?: Maybe<Scalars["String"]["output"]>;
  status?: Maybe<AnimeStatusEnum>;
  statusesStats?: Maybe<Array<StatusStat>>;
  studios: Array<Studio>;
  synonyms: Array<Scalars["String"]["output"]>;
  topic?: Maybe<Topic>;
  updatedAt: Scalars["ISO8601DateTime"]["output"];
  url: Scalars["String"]["output"];
  userRate?: Maybe<UserRate>;
  videos: Array<Video>;
};

export enum AnimeKindEnum {
  Cm = "cm",
  Movie = "movie",
  Music = "music",
  Ona = "ona",
  Ova = "ova",
  Pv = "pv",
  Special = "special",
  Tv = "tv",
  TvSpecial = "tv_special",
}

export enum AnimeRatingEnum {
  G = "g",
  None = "none",
  Pg = "pg",
  Pg_13 = "pg_13",
  R = "r",
  RPlus = "r_plus",
  Rx = "rx",
}

export enum AnimeStatusEnum {
  Anons = "anons",
  Ongoing = "ongoing",
  Released = "released",
}

export type Character = {
  __typename?: "Character";
  createdAt: Scalars["ISO8601DateTime"]["output"];
  description?: Maybe<Scalars["String"]["output"]>;
  descriptionHtml?: Maybe<Scalars["String"]["output"]>;
  descriptionSource?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  isAnime: Scalars["Boolean"]["output"];
  isManga: Scalars["Boolean"]["output"];
  isRanobe: Scalars["Boolean"]["output"];
  japanese?: Maybe<Scalars["String"]["output"]>;
  malId?: Maybe<Scalars["ID"]["output"]>;
  name: Scalars["String"]["output"];
  poster?: Maybe<Poster>;
  russian?: Maybe<Scalars["String"]["output"]>;
  synonyms: Array<Scalars["String"]["output"]>;
  topic?: Maybe<Topic>;
  updatedAt: Scalars["ISO8601DateTime"]["output"];
  url: Scalars["String"]["output"];
};

export type CharacterRole = {
  __typename?: "CharacterRole";
  character: Character;
  id: Scalars["ID"]["output"];
  rolesEn: Array<Scalars["String"]["output"]>;
  rolesRu: Array<Scalars["String"]["output"]>;
};

export type Contest = {
  __typename?: "Contest";
  description?: Maybe<Scalars["String"]["output"]>;
  descriptionHtml?: Maybe<Scalars["String"]["output"]>;
  descriptionSource?: Maybe<Scalars["String"]["output"]>;
  finishedOn?: Maybe<Scalars["ISO8601Date"]["output"]>;
  id: Scalars["ID"]["output"];
  matchDuration?: Maybe<Scalars["Int"]["output"]>;
  matchesInterval?: Maybe<Scalars["Int"]["output"]>;
  matchesPerRound?: Maybe<Scalars["Int"]["output"]>;
  memberType: ContestMemberTypeEnum;
  name: Scalars["String"]["output"];
  rounds: Array<ContestRound>;
  startedOn?: Maybe<Scalars["ISO8601Date"]["output"]>;
  state: ContestStateEnum;
  strategyType: ContestStrategyTypeEnum;
};

export type ContestMatch = {
  __typename?: "ContestMatch";
  id: Scalars["ID"]["output"];
  leftAnime?: Maybe<Anime>;
  leftCharacter?: Maybe<Character>;
  leftId?: Maybe<Scalars["Int"]["output"]>;
  leftVotes?: Maybe<Scalars["Int"]["output"]>;
  rightAnime?: Maybe<Anime>;
  rightCharacter?: Maybe<Character>;
  rightId?: Maybe<Scalars["Int"]["output"]>;
  rightVotes?: Maybe<Scalars["Int"]["output"]>;
  state: ContestMatchStateEnum;
  winnerId?: Maybe<Scalars["Int"]["output"]>;
};

export enum ContestMatchStateEnum {
  Created = "created",
  Finished = "finished",
  Started = "started",
}

export enum ContestMemberTypeEnum {
  Anime = "anime",
  Character = "character",
}

export type ContestRound = {
  __typename?: "ContestRound";
  id: Scalars["ID"]["output"];
  isAdditional: Scalars["Boolean"]["output"];
  matches: Array<ContestMatch>;
  name: Scalars["String"]["output"];
  number: Scalars["Int"]["output"];
  state: ContestRoundStateEnum;
};

export enum ContestRoundStateEnum {
  Created = "created",
  Finished = "finished",
  Started = "started",
}

export enum ContestStateEnum {
  Created = "created",
  Finished = "finished",
  Proposing = "proposing",
  Started = "started",
}

export enum ContestStrategyTypeEnum {
  DoubleElimination = "double_elimination",
  PlayOff = "play_off",
  Swiss = "swiss",
}

export type ExternalLink = {
  __typename?: "ExternalLink";
  createdAt?: Maybe<Scalars["ISO8601DateTime"]["output"]>;
  id?: Maybe<Scalars["ID"]["output"]>;
  kind: ExternalLinkKindEnum;
  updatedAt?: Maybe<Scalars["ISO8601DateTime"]["output"]>;
  url: Scalars["String"]["output"];
};

export enum ExternalLinkKindEnum {
  Amazon = "amazon",
  AnimeDb = "anime_db",
  AnimeNewsNetwork = "anime_news_network",
  Crunchyroll = "crunchyroll",
  Hidive = "hidive",
  Hulu = "hulu",
  Ivi = "ivi",
  KageProject = "kage_project",
  Kinopoisk = "kinopoisk",
  KinopoiskHd = "kinopoisk_hd",
  Mangachan = "mangachan",
  Mangadex = "mangadex",
  Mangafox = "mangafox",
  Mangahub = "mangahub",
  Mangalib = "mangalib",
  Mangaupdates = "mangaupdates",
  MoreTv = "more_tv",
  Myanimelist = "myanimelist",
  Netflix = "netflix",
  NovelTl = "novel_tl",
  Novelupdates = "novelupdates",
  OfficialSite = "official_site",
  Okko = "okko",
  Ranobelib = "ranobelib",
  Readmanga = "readmanga",
  Remanga = "remanga",
  Ruranobe = "ruranobe",
  SmotretAnime = "smotret_anime",
  SubsComRu = "subs_com_ru",
  Twitter = "twitter",
  Wakanim = "wakanim",
  Wikipedia = "wikipedia",
  Wink = "wink",
  WorldArt = "world_art",
  Youtube = "youtube",
}

export type Genre = {
  __typename?: "Genre";
  entryType: GenreEntryTypeEnum;
  id: Scalars["ID"]["output"];
  kind: GenreKindEnum;
  name: Scalars["String"]["output"];
  russian: Scalars["String"]["output"];
};

export enum GenreEntryTypeEnum {
  Anime = "Anime",
  Manga = "Manga",
}

export enum GenreKindEnum {
  Demographic = "demographic",
  Genre = "genre",
  Theme = "theme",
}

export type IncompleteDate = {
  __typename?: "IncompleteDate";
  date?: Maybe<Scalars["ISO8601Date"]["output"]>;
  day?: Maybe<Scalars["Int"]["output"]>;
  month?: Maybe<Scalars["Int"]["output"]>;
  year?: Maybe<Scalars["Int"]["output"]>;
};

export type Manga = {
  __typename?: "Manga";
  airedOn?: Maybe<IncompleteDate>;
  chapters: Scalars["Int"]["output"];
  characterRoles?: Maybe<Array<CharacterRole>>;
  chronology?: Maybe<Array<Manga>>;
  createdAt: Scalars["ISO8601DateTime"]["output"];
  description?: Maybe<Scalars["String"]["output"]>;
  descriptionHtml?: Maybe<Scalars["String"]["output"]>;
  descriptionSource?: Maybe<Scalars["String"]["output"]>;
  english?: Maybe<Scalars["String"]["output"]>;
  externalLinks?: Maybe<Array<ExternalLink>>;
  franchise?: Maybe<Scalars["String"]["output"]>;
  genres?: Maybe<Array<Genre>>;
  id: Scalars["ID"]["output"];
  isCensored?: Maybe<Scalars["Boolean"]["output"]>;
  japanese?: Maybe<Scalars["String"]["output"]>;
  kind?: Maybe<MangaKindEnum>;
  licenseNameRu?: Maybe<Scalars["String"]["output"]>;
  licensors?: Maybe<Array<Scalars["String"]["output"]>>;
  malId?: Maybe<Scalars["ID"]["output"]>;
  name: Scalars["String"]["output"];
  personRoles?: Maybe<Array<PersonRole>>;
  poster?: Maybe<Poster>;
  publishers: Array<Publisher>;
  related?: Maybe<Array<Related>>;
  releasedOn?: Maybe<IncompleteDate>;
  russian?: Maybe<Scalars["String"]["output"]>;
  score?: Maybe<Scalars["Float"]["output"]>;
  scoresStats?: Maybe<Array<ScoreStat>>;
  status?: Maybe<MangaStatusEnum>;
  statusesStats?: Maybe<Array<StatusStat>>;
  synonyms: Array<Scalars["String"]["output"]>;
  topic?: Maybe<Topic>;
  updatedAt: Scalars["ISO8601DateTime"]["output"];
  url: Scalars["String"]["output"];
  userRate?: Maybe<UserRate>;
  volumes: Scalars["Int"]["output"];
};

export enum MangaKindEnum {
  Doujin = "doujin",
  LightNovel = "light_novel",
  Manga = "manga",
  Manhua = "manhua",
  Manhwa = "manhwa",
  Novel = "novel",
  OneShot = "one_shot",
}

export enum MangaStatusEnum {
  Anons = "anons",
  Discontinued = "discontinued",
  Ongoing = "ongoing",
  Paused = "paused",
  Released = "released",
}

export type Mutation = {
  __typename?: "Mutation";
  testField: Scalars["String"]["output"];
};

export enum OrderEnum {
  AiredOn = "aired_on",
  CreatedAt = "created_at",
  CreatedAtDesc = "created_at_desc",
  Episodes = "episodes",
  Id = "id",
  IdDesc = "id_desc",
  Kind = "kind",
  Name = "name",
  Popularity = "popularity",
  Random = "random",
  Ranked = "ranked",
  RankedRandom = "ranked_random",
  RankedShiki = "ranked_shiki",
  Status = "status",
}

export type Person = {
  __typename?: "Person";
  birthOn?: Maybe<IncompleteDate>;
  createdAt: Scalars["ISO8601DateTime"]["output"];
  deceasedOn?: Maybe<IncompleteDate>;
  id: Scalars["ID"]["output"];
  isMangaka: Scalars["Boolean"]["output"];
  isProducer: Scalars["Boolean"]["output"];
  isSeyu: Scalars["Boolean"]["output"];
  japanese?: Maybe<Scalars["String"]["output"]>;
  malId?: Maybe<Scalars["ID"]["output"]>;
  name: Scalars["String"]["output"];
  poster?: Maybe<Poster>;
  russian?: Maybe<Scalars["String"]["output"]>;
  synonyms: Array<Scalars["String"]["output"]>;
  topic?: Maybe<Topic>;
  updatedAt: Scalars["ISO8601DateTime"]["output"];
  url: Scalars["String"]["output"];
  website?: Maybe<Scalars["String"]["output"]>;
};

export type PersonRole = {
  __typename?: "PersonRole";
  id: Scalars["ID"]["output"];
  person: Person;
  rolesEn: Array<Scalars["String"]["output"]>;
  rolesRu: Array<Scalars["String"]["output"]>;
};

export type Poster = {
  __typename?: "Poster";
  id: Scalars["ID"]["output"];
  main2xUrl: Scalars["String"]["output"];
  mainAlt2xUrl: Scalars["String"]["output"];
  mainAltUrl: Scalars["String"]["output"];
  mainUrl: Scalars["String"]["output"];
  mini2xUrl: Scalars["String"]["output"];
  miniAlt2xUrl: Scalars["String"]["output"];
  miniAltUrl: Scalars["String"]["output"];
  miniUrl: Scalars["String"]["output"];
  originalUrl: Scalars["String"]["output"];
  preview2xUrl: Scalars["String"]["output"];
  previewAlt2xUrl: Scalars["String"]["output"];
  previewAltUrl: Scalars["String"]["output"];
  previewUrl: Scalars["String"]["output"];
};

export type Publisher = {
  __typename?: "Publisher";
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
};

export type Query = {
  __typename?: "Query";
  animes: Array<Anime>;
  characters: Array<Character>;
  contests: Array<Contest>;
  currentUser?: Maybe<User>;
  genres: Array<Genre>;
  mangas: Array<Manga>;
  people: Array<Person>;
  userRates: Array<UserRate>;
  users: Array<User>;
};

export type QueryAnimesArgs = {
  censored?: InputMaybe<Scalars["Boolean"]["input"]>;
  duration?: InputMaybe<Scalars["DurationString"]["input"]>;
  excludeIds?: InputMaybe<Scalars["String"]["input"]>;
  franchise?: InputMaybe<Scalars["String"]["input"]>;
  genre?: InputMaybe<Scalars["String"]["input"]>;
  ids?: InputMaybe<Scalars["String"]["input"]>;
  kind?: InputMaybe<Scalars["AnimeKindString"]["input"]>;
  limit?: InputMaybe<Scalars["PositiveInt"]["input"]>;
  mylist?: InputMaybe<Scalars["MylistString"]["input"]>;
  order?: InputMaybe<OrderEnum>;
  page?: InputMaybe<Scalars["PositiveInt"]["input"]>;
  rating?: InputMaybe<Scalars["RatingString"]["input"]>;
  score?: InputMaybe<Scalars["Int"]["input"]>;
  search?: InputMaybe<Scalars["String"]["input"]>;
  season?: InputMaybe<Scalars["SeasonString"]["input"]>;
  status?: InputMaybe<Scalars["AnimeStatusString"]["input"]>;
  studio?: InputMaybe<Scalars["String"]["input"]>;
};

export type QueryCharactersArgs = {
  ids?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  limit?: InputMaybe<Scalars["PositiveInt"]["input"]>;
  page?: InputMaybe<Scalars["PositiveInt"]["input"]>;
  search?: InputMaybe<Scalars["String"]["input"]>;
};

export type QueryContestsArgs = {
  ids?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  limit?: InputMaybe<Scalars["PositiveInt"]["input"]>;
  page?: InputMaybe<Scalars["PositiveInt"]["input"]>;
};

export type QueryGenresArgs = {
  entryType: GenreEntryTypeEnum;
};

export type QueryMangasArgs = {
  censored?: InputMaybe<Scalars["Boolean"]["input"]>;
  excludeIds?: InputMaybe<Scalars["String"]["input"]>;
  franchise?: InputMaybe<Scalars["String"]["input"]>;
  genre?: InputMaybe<Scalars["String"]["input"]>;
  ids?: InputMaybe<Scalars["String"]["input"]>;
  kind?: InputMaybe<Scalars["MangaKindString"]["input"]>;
  limit?: InputMaybe<Scalars["PositiveInt"]["input"]>;
  mylist?: InputMaybe<Scalars["MylistString"]["input"]>;
  order?: InputMaybe<OrderEnum>;
  page?: InputMaybe<Scalars["PositiveInt"]["input"]>;
  publisher?: InputMaybe<Scalars["String"]["input"]>;
  score?: InputMaybe<Scalars["Int"]["input"]>;
  search?: InputMaybe<Scalars["String"]["input"]>;
  season?: InputMaybe<Scalars["SeasonString"]["input"]>;
  status?: InputMaybe<Scalars["MangaStatusString"]["input"]>;
};

export type QueryPeopleArgs = {
  ids?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  isMangaka?: InputMaybe<Scalars["Boolean"]["input"]>;
  isProducer?: InputMaybe<Scalars["Boolean"]["input"]>;
  isSeyu?: InputMaybe<Scalars["Boolean"]["input"]>;
  limit?: InputMaybe<Scalars["PositiveInt"]["input"]>;
  page?: InputMaybe<Scalars["PositiveInt"]["input"]>;
  search?: InputMaybe<Scalars["String"]["input"]>;
};

export type QueryUserRatesArgs = {
  limit?: InputMaybe<Scalars["PositiveInt"]["input"]>;
  order?: InputMaybe<UserRateOrderInputType>;
  page?: InputMaybe<Scalars["PositiveInt"]["input"]>;
  status?: InputMaybe<UserRateStatusEnum>;
  targetType: UserRateTargetTypeEnum;
  userId?: InputMaybe<Scalars["ID"]["input"]>;
};

export type QueryUsersArgs = {
  ids?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  limit?: InputMaybe<Scalars["PositiveInt"]["input"]>;
  page?: InputMaybe<Scalars["PositiveInt"]["input"]>;
  search?: InputMaybe<Scalars["String"]["input"]>;
};

export type Related = {
  __typename?: "Related";
  anime?: Maybe<Anime>;
  id: Scalars["ID"]["output"];
  manga?: Maybe<Manga>;
  /** @deprecated use relation_kind/relation_text instead. This field will be deleted after 2025-01-01 */
  relationEn: Scalars["String"]["output"];
  relationKind: RelationKindEnum;
  /** @deprecated use relation_kind/relation_text instead. This field will be deleted after 2025-01-01 */
  relationRu: Scalars["String"]["output"];
  relationText: Scalars["String"]["output"];
};

export enum RelationKindEnum {
  Adaptation = "adaptation",
  AlternativeSetting = "alternative_setting",
  AlternativeVersion = "alternative_version",
  Character = "character",
  FullStory = "full_story",
  Other = "other",
  ParentStory = "parent_story",
  Prequel = "prequel",
  Sequel = "sequel",
  SideStory = "side_story",
  SpinOff = "spin_off",
  Summary = "summary",
}

export type ScoreStat = {
  __typename?: "ScoreStat";
  count: Scalars["Int"]["output"];
  score: Scalars["Int"]["output"];
};

export type Screenshot = {
  __typename?: "Screenshot";
  id: Scalars["ID"]["output"];
  originalUrl: Scalars["String"]["output"];
  x166Url: Scalars["String"]["output"];
  x332Url: Scalars["String"]["output"];
};

export enum SortOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export type StatusStat = {
  __typename?: "StatusStat";
  count: Scalars["Int"]["output"];
  status: UserRateStatusEnum;
};

export type Studio = {
  __typename?: "Studio";
  id: Scalars["ID"]["output"];
  imageUrl?: Maybe<Scalars["String"]["output"]>;
  name: Scalars["String"]["output"];
};

export type Topic = {
  __typename?: "Topic";
  body: Scalars["String"]["output"];
  commentsCount: Scalars["Int"]["output"];
  createdAt: Scalars["ISO8601DateTime"]["output"];
  htmlBody: Scalars["String"]["output"];
  id?: Maybe<Scalars["ID"]["output"]>;
  tags: Array<Scalars["String"]["output"]>;
  title: Scalars["String"]["output"];
  type: Scalars["String"]["output"];
  updatedAt: Scalars["ISO8601DateTime"]["output"];
  url: Scalars["String"]["output"];
};

export type User = {
  __typename?: "User";
  avatarUrl: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  lastOnlineAt: Scalars["ISO8601DateTime"]["output"];
  nickname: Scalars["String"]["output"];
  url: Scalars["String"]["output"];
};

export type UserRate = {
  __typename?: "UserRate";
  anime?: Maybe<Anime>;
  chapters: Scalars["Int"]["output"];
  createdAt: Scalars["ISO8601DateTime"]["output"];
  episodes: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
  manga?: Maybe<Manga>;
  rewatches: Scalars["Int"]["output"];
  score: Scalars["Int"]["output"];
  status: UserRateStatusEnum;
  text?: Maybe<Scalars["String"]["output"]>;
  updatedAt: Scalars["ISO8601DateTime"]["output"];
  volumes: Scalars["Int"]["output"];
};

export enum UserRateOrderFieldEnum {
  Id = "id",
  UpdatedAt = "updated_at",
}

export type UserRateOrderInputType = {
  field: UserRateOrderFieldEnum;
  order: SortOrderEnum;
};

export enum UserRateStatusEnum {
  Completed = "completed",
  Dropped = "dropped",
  OnHold = "on_hold",
  Planned = "planned",
  Rewatching = "rewatching",
  Watching = "watching",
}

export enum UserRateTargetTypeEnum {
  Anime = "Anime",
  Manga = "Manga",
}

export type Video = {
  __typename?: "Video";
  id: Scalars["ID"]["output"];
  imageUrl: Scalars["String"]["output"];
  kind: VideoKindEnum;
  name?: Maybe<Scalars["String"]["output"]>;
  playerUrl: Scalars["String"]["output"];
  url: Scalars["String"]["output"];
};

export enum VideoKindEnum {
  CharacterTrailer = "character_trailer",
  Clip = "clip",
  Cm = "cm",
  Ed = "ed",
  EpisodePreview = "episode_preview",
  Op = "op",
  OpEdClip = "op_ed_clip",
  Other = "other",
  Pv = "pv",
}

export type SearchAnimeQueryVariables = Exact<{
  search: Scalars["String"]["input"];
  page?: InputMaybe<Scalars["PositiveInt"]["input"]>;
  limit: Scalars["PositiveInt"]["input"];
}>;

export type SearchAnimeQuery = {
  __typename?: "Query";
  animes: Array<{
    __typename?: "Anime";
    id: string;
    name: string;
    russian?: string | null;
    japanese?: string | null;
    isCensored?: boolean | null;
    url: string;
    poster?: { __typename?: "Poster"; originalUrl: string } | null;
  }>;
};

export type SearchMangaQueryVariables = Exact<{
  search: Scalars["String"]["input"];
  page?: InputMaybe<Scalars["PositiveInt"]["input"]>;
  limit: Scalars["PositiveInt"]["input"];
}>;

export type SearchMangaQuery = {
  __typename?: "Query";
  mangas: Array<{
    __typename?: "Manga";
    id: string;
    name: string;
    russian?: string | null;
    japanese?: string | null;
    isCensored?: boolean | null;
    url: string;
    poster?: { __typename?: "Poster"; originalUrl: string } | null;
  }>;
};

export type AnimeTitleQueryVariables = Exact<{
  id: Scalars["String"]["input"];
}>;

export type AnimeTitleQuery = {
  __typename?: "Query";
  animes: Array<{
    __typename?: "Anime";
    id: string;
    name: string;
    russian?: string | null;
    japanese?: string | null;
    kind?: AnimeKindEnum | null;
    rating?: AnimeRatingEnum | null;
    score?: number | null;
    status?: AnimeStatusEnum | null;
    episodes: number;
    episodesAired: number;
    duration?: number | null;
    url: string;
    fandubbers: Array<string>;
    fansubbers: Array<string>;
    nextEpisodeAt?: any | null;
    isCensored?: boolean | null;
    descriptionHtml?: string | null;
    descriptionSource?: string | null;
    airedOn?: {
      __typename?: "IncompleteDate";
      day?: number | null;
      month?: number | null;
      year?: number | null;
    } | null;
    releasedOn?: {
      __typename?: "IncompleteDate";
      day?: number | null;
      month?: number | null;
      year?: number | null;
    } | null;
    poster?: { __typename?: "Poster"; originalUrl: string } | null;
    genres?: Array<{ __typename?: "Genre"; russian: string }> | null;
    studios: Array<{ __typename?: "Studio"; name: string }>;
  }>;
};

export type AnimeScreenshotsQueryVariables = Exact<{
  animeId: Scalars["String"]["input"];
}>;

export type AnimeScreenshotsQuery = {
  __typename?: "Query";
  animes: Array<{
    __typename?: "Anime";
    screenshots: Array<{ __typename?: "Screenshot"; id: string; originalUrl: string }>;
  }>;
};

export type AnimeVideosQueryVariables = Exact<{
  animeId: Scalars["String"]["input"];
}>;

export type AnimeVideosQuery = {
  __typename?: "Query";
  animes: Array<{
    __typename?: "Anime";
    videos: Array<{
      __typename?: "Video";
      id: string;
      kind: VideoKindEnum;
      name?: string | null;
      playerUrl: string;
      imageUrl: string;
      url: string;
    }>;
  }>;
};

export type MangaTitleQueryVariables = Exact<{
  id: Scalars["String"]["input"];
}>;

export type MangaTitleQuery = {
  __typename?: "Query";
  mangas: Array<{
    __typename?: "Manga";
    id: string;
    kind?: MangaKindEnum | null;
    name: string;
    russian?: string | null;
    japanese?: string | null;
    score?: number | null;
    status?: MangaStatusEnum | null;
    volumes: number;
    chapters: number;
    url: string;
    isCensored?: boolean | null;
    descriptionHtml?: string | null;
    descriptionSource?: string | null;
    airedOn?: {
      __typename?: "IncompleteDate";
      day?: number | null;
      month?: number | null;
      year?: number | null;
    } | null;
    releasedOn?: {
      __typename?: "IncompleteDate";
      day?: number | null;
      month?: number | null;
      year?: number | null;
    } | null;
    poster?: { __typename?: "Poster"; originalUrl: string } | null;
    genres?: Array<{ __typename?: "Genre"; russian: string }> | null;
    publishers: Array<{ __typename?: "Publisher"; name: string }>;
  }>;
};

export type AnimeCharactersQueryVariables = Exact<{
  animeId: Scalars["String"]["input"];
}>;

export type AnimeCharactersQuery = {
  __typename?: "Query";
  animes: Array<{
    __typename?: "Anime";
    characterRoles?: Array<{
      __typename?: "CharacterRole";
      character: {
        __typename?: "Character";
        id: string;
        name: string;
        russian?: string | null;
        japanese?: string | null;
        url: string;
        poster?: { __typename?: "Poster"; originalUrl: string } | null;
      };
    }> | null;
  }>;
};

export type MangaCharactersQueryVariables = Exact<{
  mangaId: Scalars["String"]["input"];
}>;

export type MangaCharactersQuery = {
  __typename?: "Query";
  mangas: Array<{
    __typename?: "Manga";
    characterRoles?: Array<{
      __typename?: "CharacterRole";
      character: {
        __typename?: "Character";
        id: string;
        name: string;
        russian?: string | null;
        japanese?: string | null;
        url: string;
        poster?: { __typename?: "Poster"; originalUrl: string } | null;
      };
    }> | null;
  }>;
};

export type CharacterQueryVariables = Exact<{
  id?: InputMaybe<Array<Scalars["ID"]["input"]> | Scalars["ID"]["input"]>;
}>;

export type CharacterQuery = {
  __typename?: "Query";
  characters: Array<{
    __typename?: "Character";
    id: string;
    name: string;
    russian?: string | null;
    japanese?: string | null;
    url: string;
    descriptionHtml?: string | null;
    descriptionSource?: string | null;
    poster?: { __typename?: "Poster"; originalUrl: string } | null;
  }>;
};

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: DocumentTypeDecoration<TResult, TVariables>["__apiType"];

  constructor(
    private value: string,
    public __meta__?: Record<string, any>,
  ) {
    super(value);
  }

  toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}

export const SearchAnimeDocument = new TypedDocumentString(`
    query SearchAnime($search: String!, $page: PositiveInt, $limit: PositiveInt!) {
  animes(search: $search, page: $page, limit: $limit) {
    id
    name
    russian
    japanese
    isCensored
    url
    poster {
      originalUrl
    }
  }
}
    `) as unknown as TypedDocumentString<SearchAnimeQuery, SearchAnimeQueryVariables>;
export const SearchMangaDocument = new TypedDocumentString(`
    query SearchManga($search: String!, $page: PositiveInt, $limit: PositiveInt!) {
  mangas(search: $search, page: $page, limit: $limit) {
    id
    name
    russian
    japanese
    isCensored
    url
    poster {
      originalUrl
    }
  }
}
    `) as unknown as TypedDocumentString<SearchMangaQuery, SearchMangaQueryVariables>;
export const AnimeTitleDocument = new TypedDocumentString(`
    query AnimeTitle($id: String!) {
  animes(ids: $id) {
    id
    name
    russian
    japanese
    kind
    rating
    score
    status
    episodes
    episodesAired
    duration
    airedOn {
      day
      month
      year
    }
    releasedOn {
      day
      month
      year
    }
    url
    poster {
      originalUrl
    }
    fandubbers
    fansubbers
    nextEpisodeAt
    isCensored
    genres {
      russian
    }
    studios {
      name
    }
    descriptionHtml
    descriptionSource
  }
}
    `) as unknown as TypedDocumentString<AnimeTitleQuery, AnimeTitleQueryVariables>;
export const AnimeScreenshotsDocument = new TypedDocumentString(`
    query AnimeScreenshots($animeId: String!) {
  animes(ids: $animeId) {
    screenshots {
      id
      originalUrl
    }
  }
}
    `) as unknown as TypedDocumentString<AnimeScreenshotsQuery, AnimeScreenshotsQueryVariables>;
export const AnimeVideosDocument = new TypedDocumentString(`
    query AnimeVideos($animeId: String!) {
  animes(ids: $animeId) {
    videos {
      id
      kind
      name
      playerUrl
      imageUrl
      url
    }
  }
}
    `) as unknown as TypedDocumentString<AnimeVideosQuery, AnimeVideosQueryVariables>;
export const MangaTitleDocument = new TypedDocumentString(`
    query MangaTitle($id: String!) {
  mangas(ids: $id) {
    id
    kind
    name
    russian
    japanese
    score
    status
    volumes
    chapters
    airedOn {
      day
      month
      year
    }
    releasedOn {
      day
      month
      year
    }
    url
    poster {
      originalUrl
    }
    isCensored
    genres {
      russian
    }
    publishers {
      name
    }
    descriptionHtml
    descriptionSource
  }
}
    `) as unknown as TypedDocumentString<MangaTitleQuery, MangaTitleQueryVariables>;
export const AnimeCharactersDocument = new TypedDocumentString(`
    query AnimeCharacters($animeId: String!) {
  animes(ids: $animeId) {
    characterRoles {
      character {
        id
        name
        russian
        japanese
        url
        poster {
          originalUrl
        }
      }
    }
  }
}
    `) as unknown as TypedDocumentString<AnimeCharactersQuery, AnimeCharactersQueryVariables>;
export const MangaCharactersDocument = new TypedDocumentString(`
    query MangaCharacters($mangaId: String!) {
  mangas(ids: $mangaId) {
    characterRoles {
      character {
        id
        name
        russian
        japanese
        url
        poster {
          originalUrl
        }
      }
    }
  }
}
    `) as unknown as TypedDocumentString<MangaCharactersQuery, MangaCharactersQueryVariables>;
export const CharacterDocument = new TypedDocumentString(`
    query Character($id: [ID!]) {
  characters(ids: $id) {
    id
    name
    russian
    japanese
    poster {
      originalUrl
    }
    url
    descriptionHtml
    descriptionSource
  }
}
    `) as unknown as TypedDocumentString<CharacterQuery, CharacterQueryVariables>;
