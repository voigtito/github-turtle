export default interface Commit {
  commit: {
    author: {
      name: string;
      email: string;
      date: string | Date;
    },
    message: string;
  }
  author: {
    login: string;
    id: number;
  },
}