import { create } from 'zustand'

interface User {
  id: string
  username: string
  email: string
}

interface Post {
  id: string
  title: string
  content: string
  author: string
  upvotes: number
  comments: number
  createdAt: string
}

interface AppState {
  user: User | null
  posts: Post[]
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setPosts: (posts: Post[]) => void
  logout: () => void
}

export const useStore = create<AppState>((set) => ({
  user:  {
    id: '123',
    username: 'sadas',
    email: 'sadas@gmail.com'
  },
  posts: [],
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setPosts: (posts) => set({ posts }),
  logout: () => set({ user: null, isAuthenticated: false }),
})) 