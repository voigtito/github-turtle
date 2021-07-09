import { Router, Request, Response } from 'express';
import { GithubService } from '../services/GithubService';
import AppError from '../errors/AppError';
import { celebrate, Segments, Joi } from 'celebrate';

const githubRouter = Router();

githubRouter.get('/all', celebrate({[Segments.QUERY]: {
  since: Joi.required(),
  until: Joi.required(),
  user: Joi.required(),
  repository: Joi.required(),
}}) , async (request: Request, response: Response) => {

  /**
   * @user username from github
   * @repository repository from the github
   * @since is the beggining date range for the commits
   * @until is the limit date range for the commits
   */
  const { user, repository, since, until } = request.query;

  // Instance the Github service class to call its methods.
  let githubService = new GithubService(since, until, user, repository);

  // Method to create the time range.
  await githubService.createRangeTime();

  // Method to add contributors to the range time.
  let checkErrorRangeTime = await githubService.addContributorsToRangeTime();

  // Used to throw error in the requisition.
  if (checkErrorRangeTime instanceof AppError) {
    return response.json(checkErrorRangeTime);
  }

  // Relate commits to its contributors according to date.
  let data = await githubService.addCommitsToContributorsByDate();

  // Used to throw error in the requisition.
  if (data instanceof AppError) {
    return response.json(data);
  }

  // Returning the range date with all information needed.
  return response.json(data);

});

export default githubRouter;
