export interface GitNode {
  id: string;
  label: string;
  data: {
    author: string;
    date: string;
    message: string;
    branchColor: string;
  };
}

export interface GitLink {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface Commit {
  hash: string;
  author: string;
  date: string;
  message: string;
}
