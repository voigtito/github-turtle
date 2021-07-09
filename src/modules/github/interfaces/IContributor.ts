import Commit from './ICommit';

export default interface Contributor {
  id: number;
  login: string;
  avatar_url: string;
  contributionsByDate: number;
  commits: Commit[];
}