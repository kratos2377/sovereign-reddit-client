import { create } from 'zustand'
import { apiService } from '../services/api'

export interface User {
  sov_id: string
  username: string
}

export interface Post {
  post_sov_id: string
  title: string
  content: string
  user_sov_id: string 
  upvotes: number
  downvotes: number
  score: number
  comments: number
  createdAt: string
  updatedAt: string
}

export interface SubMods {
  id: string,
  user_sov_id: string,
  sub_sov_id: string,
  subname: string,
  createdAt: string
  updatedAt: string
}

export interface Subreddit {
  sub_sov_id: string,
  subname: string,
  createdAt: string
  updatedAt: string,
  sub_description: string,
}

export interface Comment {
  id: string,
  post_sov_id: string,
  user_sov_id: string,
  content: string,
  createdAt: string,
  updatedAt: string,
  score: number,
  upvote: number,
  downvote: number,
}

export interface UserJoinedSubs {
  id: string,
  user_sov_id: string,
  sub_sov_id: string,
  created_at: string,
  updated_at: string,
}

export interface UserLikedPosts { 

   id: string,
   user_sov_id: string,
   post_sov_id: string,
   value: number,
   created_at: string,
   updated_at: string,

}

export interface AppState {
  user: User | null
  posts: Post[]
  comments: Comment[]
  userSubs: UserJoinedSubs[]
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setPosts: (posts: Post[]) => void
  setComments: (comments: Comment[]) => void
  setUserSubs: (subs: UserJoinedSubs[]) => void
  logout: () => void
  resetAllStates: () => void
  // API actions
  fetchUserSubs: (user_sov_id: string) => Promise<void>
  joinOrUnjoinSub: (user_sov_id: string, sub_sov_id: string) => Promise<void>
  addComment: (post_sov_id: string, user_sov_id: string, content: string) => Promise<void>
  likeOrDislikePost: (user_sov_id: string, post_sov_id: string, value: number) => Promise<void>
  getUserPosts: (user_sov_id: string) => Promise<void>
  getUserComments: (user_sov_id: string) => Promise<void>
  getSubredditPosts: (sub_sov_id: string) => Promise<void>
  getPostComments: (post_sov_id: string) => Promise<void>
  getUserFeed: (user_sov_id: string) => Promise<void>
}

export const useStore = create<AppState>((set) => ({
  user: null,
  posts: [],
  comments: [],
  userSubs: [],
  isAuthenticated: false,
  
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setPosts: (posts) => set({ posts }),
  setComments: (comments) => set({ comments }),
  setUserSubs: (userSubs) => set({ userSubs }),
  logout: () => set({ user: null, isAuthenticated: false }),
  resetAllStates: () => set({ 
    user: null, 
    posts: [], 
    comments: [], 
    userSubs: [], 
    isAuthenticated: false 
  }),

  // API actions
  fetchUserSubs: async (user_sov_id) => {
    try {
      const subs = await apiService.getUserSubs(user_sov_id);
      set({ userSubs: subs });
    } catch (error) {
      console.error('Error fetching user subs:', error);
    }
  },

  joinOrUnjoinSub: async (user_sov_id, sub_sov_id) => {
    try {
      await apiService.joinOrUnjoinSub({ user_sov_id, sub_sov_id });
      // Refresh user subs after joining/unjoining
      const subs = await apiService.getUserSubs(user_sov_id);
      set({ userSubs: subs });
    } catch (error) {
      console.error('Error joining/unjoining sub:', error);
    }
  },

  addComment: async (post_sov_id, user_sov_id, content) => {
    try {
      await apiService.addComment({ post_sov_id, user_sov_id, content });
      // Refresh comments after adding
      const comments = await apiService.getPostComments({ post_sov_id });
      set({ comments });
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  },

  likeOrDislikePost: async (user_sov_id, post_sov_id, value) => {
    try {
      await apiService.likeOrDislikePost({ user_sov_id, post_sov_id, value });
      // Refresh posts after like/dislike
      const posts = await apiService.getUserFeed({ user_sov_id });
      set({ posts });
    } catch (error) {
      console.error('Error liking/disliking post:', error);
    }
  },

  getUserPosts: async (user_sov_id) => {
    try {
      const posts = await apiService.getUserPosts({ user_sov_id });
      set({ posts });
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  },

  getUserComments: async (user_sov_id) => {
    try {
      const comments = await apiService.getUserComments({ user_sov_id });
      set({ comments });
    } catch (error) {
      console.error('Error fetching user comments:', error);
    }
  },

  getSubredditPosts: async (sub_sov_id) => {
    try {
      const posts = await apiService.getSubredditPosts({ sub_sov_id });
      set({ posts });
    } catch (error) {
      console.error('Error fetching subreddit posts:', error);
    }
  },

  getPostComments: async (post_sov_id) => {
    try {
      const comments = await apiService.getPostComments({ post_sov_id });
      set({ comments });
    } catch (error) {
      console.error('Error fetching post comments:', error);
    }
  },

  getUserFeed: async (user_sov_id) => {
    try {
      const posts = await apiService.getUserFeed({ user_sov_id });
      set({ posts });
    } catch (error) {
      console.error('Error fetching user feed:', error);
    }
  },
})) 