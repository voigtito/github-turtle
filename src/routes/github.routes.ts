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

  let githubService = new GithubService(since, until, user, repository);

  await githubService.createRangeTime();

  let checkErrorRangeTime = await githubService.addContributorsToRangeTime();

  // Used to throw error in the requisition.
  if (checkErrorRangeTime instanceof AppError) {
    return response.json(checkErrorRangeTime);
  }

  let data = await githubService.addCommitsToContributorsByDate();

  // Used to throw error in the requisition.
  if (data instanceof AppError) {
    return response.json(data);
  }

  // Returning the range date with all information needed.
  return response.json(data);

});

export default githubRouter;
