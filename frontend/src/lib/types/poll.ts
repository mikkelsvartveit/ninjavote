export interface IVoterSession {
  nickname: string;
  voterId: string;
  voterSecret: string;
}

export interface IVote {
  id: number;
  name: string;
  optionId: number;
  voterId: string;
  voterSecret?: string;
}

export interface IOption {
  id: number;
  text: string;
  pollId: number;
  votes: IVote[];
}

export interface IPoll {
  id: number;
  question: string;
  options: IOption[];
}
