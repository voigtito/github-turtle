import { Router, Request, Response } from 'express';
import axios from 'axios';
import { GithubService } from '../services/GithubService';
import AppError from '../errors/AppError';

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

interface Contributor {
  id: number;
  login: string;
  avatar_url: string;
  contributionsByDate: number;
  commits: Commit[];
}

interface ListOfDates {
  id: number;
  date: Date;
  contributors?: Contributor[];
}

githubRouter.get('/all', async (request: Request, response: Response) => {

  /**
   * @user username from github
   * @repository repository from the github
   * @since is the beggining date range for the commits
   * @until is the limit date range for the commits
   */
  const { user, repository, since, until } = request.query;

  let contributors
  let commits
  let formattedDateSince = new Date(String(since));
  let formattedDateUntil = new Date(String(until));

  let githubService = new GithubService(formattedDateSince, formattedDateUntil);

  try {
    contributors = await axios.get<Contributor[]>(`https://api.github.com/repos/${user}/${repository}/contributors`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.GITHUB_KEY}`
        }
      }
    );
  } catch (error) {
    return response.json(error)
  }

  await githubService.createRangeTime();

  let checkErrorRangeTime = await githubService.addContributorsToRangeTime(contributors);

  // Used to throw error in the requisition.
  if (checkErrorRangeTime instanceof AppError) {
    return response.json(checkErrorRangeTime);
  }

  try {
    commits = await axios.get<Commit[]>(`https://api.github.com/repos/${user}/${repository}/commits`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.GITHUB_KEY}`
        },
        params: {
          // ISOString is need by the github docs.
          since: formattedDateSince.toISOString(),
          until: formattedDateUntil.toISOString()
        }
      }
    );
  } catch (error) {
    return response.json(error)
  }

  let data = await githubService.addCommitsToContributorsByDate(commits);

  // Used to throw error in the requisition.
  if (data instanceof AppError) {
    return response.json(data);
  }

  // Returning the range date with all information needed.
  return response.json(data);

});

export default githubRouter;
