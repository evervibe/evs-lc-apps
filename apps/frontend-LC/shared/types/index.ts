// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  cash: number;
  role: UserRole;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export enum UserRole {
  USER = "user",
  MODERATOR = "moderator",
  ADMIN = "admin",
}

// Auth Types
export interface LoginRequest {
  username: string;
  password: string;
  totp_code?: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
  recaptcha_token?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

// News Types
export interface NewsArticle {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  author_id: number;
  author_name?: string;
  category?: string;
  image_url?: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

// Market Types
export interface MarketItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  item_id: number;
  category?: string;
  image_url?: string;
  stock?: number;
}

// Ranking Types
export interface CharacterRanking {
  rank: number;
  character_name: string;
  level: number;
  class: string;
  guild_name?: string;
  exp: number;
}

export interface GuildRanking {
  rank: number;
  guild_name: string;
  level: number;
  members_count: number;
  master_name: string;
}

// Ticket Types
export interface Ticket {
  id: number;
  user_id: number;
  username?: string;
  subject: string;
  message: string;
  status: TicketStatus;
  priority?: TicketPriority;
  category?: string;
  created_at: string;
  updated_at: string;
  closed_at?: string;
}

export enum TicketStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  CLOSED = "closed",
}

export enum TicketPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export interface TicketReply {
  id: number;
  ticket_id: number;
  user_id: number;
  username?: string;
  message: string;
  is_staff: boolean;
  created_at: string;
}

// Redeem Code Types
export interface RedeemCode {
  id: number;
  code: string;
  type: RedeemCodeType;
  value: number;
  max_uses?: number;
  uses_count: number;
  expires_at?: string;
  created_at: string;
  created_by?: number;
}

export enum RedeemCodeType {
  CASH = "cash",
  ITEM = "item",
  BUNDLE = "bundle",
}

// Activity Log Types
export interface ActivityLog {
  id: number;
  user_id: number;
  username?: string;
  action: string;
  entity_type?: string;
  entity_id?: number;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// Server Status Types
export interface ServerStatus {
  name: string;
  online: boolean;
  players_online?: number;
  max_players?: number;
  uptime?: number;
  last_check: string;
}

// Vote Types
export interface VoteSite {
  id: number;
  name: string;
  url: string;
  reward_cash: number;
  cooldown_hours: number;
}

export interface VoteRecord {
  id: number;
  user_id: number;
  site_id: number;
  site_name?: string;
  reward_cash: number;
  voted_at: string;
  next_vote_at: string;
}

// Download Types
export interface Download {
  id: number;
  name: string;
  version: string;
  file_url: string;
  file_size?: number;
  description?: string;
  download_count?: number;
  created_at: string;
  updated_at: string;
}

// Account Types
export interface GameAccount {
  id: number;
  account_name: string;
  user_id: number;
  created_at: string;
  last_login?: string;
  banned: boolean;
  ban_reason?: string;
}

// Event Types
export interface GameEvent {
  id: number;
  title: string;
  description: string;
  type: string;
  start_date: string;
  end_date: string;
  rewards?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}
