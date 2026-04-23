export type UserRole = 'reader' | 'blogger' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  bio_zh?: string;
  role: UserRole;
  is_approved_blogger: boolean;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author_id: string;
  category: string; // Used strictly via select input in the UI, keeping as string to allow freeform expansion.
  thumbnail_url?: string;
  attachments?: string[];
  status: 'draft' | 'published';
  created_at: string;
  author?: UserProfile;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user?: UserProfile;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  info: string;
  created_at: string;
}

export interface VolunteerProgram {
  id: string;
  title: string;
  description: string;
  location: string;
  duration: string;
  created_at: string;
}

export interface Landmark {
  id: string;
  name: string;
  name_zh?: string;
  province?: string;
  description: string;
  category: string;
  lat: number;
  lng: number;
  image_url: string;
  created_at?: string;
}
