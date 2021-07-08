import { Router, Request, Response } from 'express';
import axios from 'axios';

const githubRouter = Router();

interface Commit {
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

interface ContributorsCommits {
  commits: Commit[]
}

/**
 * *This function returns all the contributors and its commits from the repo
 */
githubRouter.get('/repository', async (request: Request, response: Response) => {

  const { user, repository, since, until } = request.query;

  let formattedDateSince = new Date(String(since)).toISOString();
  let formattedDateUntil = new Date(String(until)).toISOString();
  let repositoryData

  try {
    repositoryData = await axios.get<ContributorsCommits>(`https://api.github.com/repos/${user}/${repository}/commits`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.GITHUB_KEY}`
        },
        params: {
          since: formattedDateSince,
          until: formattedDateUntil
        }
      }
    );
  } catch (error) {
    console.log(error)
  }

  return response.json(repositoryData?.data);

});

export default githubRouter;
