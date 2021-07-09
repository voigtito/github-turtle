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

/**
 * *This function returns all the contributors from the repo
 */
githubRouter.get('/repository', async (request: Request, response: Response) => {

  const { user, repository, since, until } = request.query;

  let contributors
  let commits
  let formattedDateSince = new Date(String(since));
  let formattedDateUntil = new Date(String(until));

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

  try {
    commits = await axios.get<Commit[]>(`https://api.github.com/repos/${user}/${repository}/commits`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.GITHUB_KEY}`
        },
        params: {
          since: formattedDateSince.toISOString(),
          until: formattedDateUntil.toISOString()
        }
      }
    );
  } catch (error) {
    return response.json(error)
  }

  // Create the time range.
  let rangeOfTime = (formattedDateUntil.getTime() - formattedDateSince.getTime()) / (1000 * 3600 * 24);
  // Set the first date for the since data because the rangeOfTime has an open interval at the begining.
  let listOfDates: ListOfDates[] = [{id: 0, date: formattedDateSince, contributors: []}];

  // Iterate over the time range array.
  for (let i = 1; i <= rangeOfTime; i++) {
    // Create new date to avoid referencing the date variable.
    let refDate = new Date(formattedDateSince);
    // Add the next date from the range.
    listOfDates.push({id: i, date: new Date(refDate.setDate(refDate.getDate() + i)), contributors: []});
  }

  // Attribute the contributors to each date.
  for (let i = 0; i < listOfDates.length; i++) {
    // Add all contributors to each data because zero commit per day is also an indicator.
    contributors.data.map( contributor => {
      listOfDates[i].contributors?.push({id: contributor.id, avatar_url: contributor.avatar_url, login: contributor.login, contributionsByDate: 0, commits: []});
    });
  }

  // Interate over the commits.
  for (const [index, commit] of commits.data.entries()) {
    // Iterate over the list of ranged dates.
    listOfDates.map( (value, index) => {
      // If the date matches with the commit date.
      if (value.date.toDateString() === new Date(commit.commit.author.date).toDateString()) {
        // Find the contributor to add the commit count.
        value.contributors?.find( contributor => {
          // If the contributor id matches with the commit author id.
          if (contributor.id === commit.author.id) {
            // Sum the counter of commits per date for the user.
            contributor.contributionsByDate += 1;
            // Add information for the commit.
            contributor.commits.push({
              commit: {
                author: {
                  name: commit.commit.author.name,
                  email: commit.commit.author.email,
                  date: commit.commit.author.date
                },
                message: commit.commit.message
              },
              author: {
                login: commit.author.login,
                id: commit.author.id
              },
            })
          }
        })
        return;
      }
    });
  }

  return response.json(listOfDates);

});

export default githubRouter;
