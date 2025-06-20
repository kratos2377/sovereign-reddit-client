import axios from 'axios';

const API_BASE_URL = 'http://localhost:3006/api/v1/model';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface FetchModelParams {
  schema: string;
  primaryKey: string;
}

export interface JoinSubParams {
  user_sov_id: string;
  sub_sov_id: string;
}

export interface CommentParams {
  post_sov_id: string;
  user_sov_id: string;
  content: string;
}

export interface LikePostParams {
  user_sov_id: string;
  post_sov_id: string;
  value: number;
}

export interface UserPostsParams {
  user_sov_id: string;
}

export interface SubredditPostsParams {
  sub_sov_id: string;
}

export interface PostCommentsParams {
  post_sov_id: string;
}

export interface SearchSubredditsByNameParams {
  name: string;
}

export const apiService = {
  // Fetch model by primary key
  fetchModel: async ({ schema, primaryKey }: FetchModelParams) => {
    const response = await api.get(`/fetch/${schema}/${primaryKey}`);
    return response.data;
  },

  // Join or unjoin subreddit
  joinOrUnjoinSub: async (params: JoinSubParams) => {
    const response = await api.post('/join_or_unjoin_sub', params);
    return response.data;
  },

  // Add comment
  addComment: async (params: CommentParams) => {
    const response = await api.post('/add_comments', params);
    return response.data;
  },

  // Like or dislike post
  likeOrDislikePost: async (params: LikePostParams) => {
    const response = await api.post('/like_or_dislike_post', params);
    return response.data;
  },

  // Get user posts
  getUserPosts: async (params: UserPostsParams) => {
    const response = await api.post('/get_user_posts', params);
    return response.data;
  },

  // Get user comments
  getUserComments: async (params: UserPostsParams) => {
    const response = await api.post('/get_user_comments', params);
    return response.data;
  },

  // Get posts for subreddit
  getSubredditPosts: async (params: SubredditPostsParams) => {
    const response = await api.post('/get_posts_for_subreddit', params);
    return response.data;
  },

  // Get comments for post
  getPostComments: async (params: PostCommentsParams) => {
    const response = await api.post('/get_comments_for_posts', params);
    return response.data;
  },

  // Get user feed
  getUserFeed: async (params: UserPostsParams) => {
    const response = await api.post('/get_user_feed', params);
    return response.data;
  },

  // Get user subreddits
  getUserSubs: async (user_sov_id: string) => {
    const response = await api.get(`/get_user_subs/${user_sov_id}`);
    return response.data;
  },

  // Search subreddits by name
  searchSubredditsByName: async (params: SearchSubredditsByNameParams) => {
    const response = await api.post('/search_subreddits_by_name', params);
    return response.data;
  },
}; 