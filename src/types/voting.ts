export type CandidateId = 'lula' | 'flavio';

export interface CandidateConfig {
  id: CandidateId;
  name: string;
  shortName: string;
  number: string;
  party: string;
  avatarUrl: string;
  primaryColor: string;
  secondaryColor: string;
}

export type GiftIconType =
  | 'rose'
  | 'heart_me'
  | 'love_you'
  | 'encore_ticket'
  | 'finger_heart'
  | 'capybara'
  | 'accordion'
  | 'money_gun'
  | 'white_rose'
  | 'clap'
  | 'thumbs_up'
  | 'soccer_ball'
  | 'mini_dino'
  | 'flower_bouquet'
  | 'hat_mustache'
  | 'battle_master'
  // legacy compatibility
  | 'tiktok'
  | 'cap'
  | 'doughnut'
  | 'confetti'
  | 'crown'
  | 'galaxy'
  | 'lion'
  | 'custom';

export interface GiftItem {
  giftId: string;
  name: string;
  shortName?: string;
  sortOrder?: number;
  iconType: GiftIconType;
  customImageUrl?: string;
  coinValue: number;
  candidateId: CandidateId | 'unassigned';
  active: boolean;
}

export interface NormalizedGiftEvent {
  eventId: string;
  giftId: string;
  giftName: string;
  giftCoinValue: number;
  repeatCount?: number;
  totalCoinValue?: number;
  senderName?: string;
  timestamp?: string;
  origin: 'demo' | 'live' | 'manual_adjustment';
  justification?: string;
}

export interface VoteRecord {
  eventId: string;
  timestamp: string;
  giftId: string;
  giftName: string;
  candidateId: CandidateId;
  votesAdded: number;
  coinValueUnit: number;
  repeatCount: number;
  senderName: string;
  origin: 'demo' | 'live' | 'manual_adjustment';
  justification?: string;
}

export type VotingRoundStatus = 'running' | 'paused' | 'ended';

export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

export type OperatingMode = 'demo' | 'live';

export interface VotingStoreState {
  roundId: number;
  status: VotingRoundStatus;
  mode: OperatingMode;
  lulaVotes: number;
  flavioVotes: number;
  candidates: Record<CandidateId, CandidateConfig>;
  gifts: GiftItem[];
  history: VoteRecord[];
  processedEventIds: string[];
  websocketUrl: string;
}

export interface AnimationQueueItem {
  id: string;
  eventId: string;
  giftName: string;
  iconType: GiftItem['iconType'];
  customImageUrl?: string;
  candidateId: CandidateId;
  votesAdded: number;
  senderName: string;
  origin: 'demo' | 'live' | 'manual_adjustment';
  timestamp: number;
}
