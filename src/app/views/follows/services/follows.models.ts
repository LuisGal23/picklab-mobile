export interface FollowItem {
  id: string;
  name: string;
  type: 'team' | 'league';
  sport: string;
  nextMatch: string;
  activePicksCount: number;
}
