import ListOfDates from "../interfaces/IListOfDates";
import Commit from "../interfaces/ICommit";
import axios, { AxiosResponse } from "axios";
import Contributor from "../interfaces/IContributor";
import AppError from "../errors/AppError";
import { UrlWithStringQuery } from "url";

export class GithubService {

  constructor(
    private since: string | any,
    private until: string | any,
    private user: string | any,
    private repository: string | any,
    private range?: number,
    private listOfDates?: ListOfDates[],
    private contributors?: AxiosResponse<Contributor[]>,
    private commits?: AxiosResponse<Commit[]>,
  ) { 
    this.since = new Date(String(this.since));
    this.until = new Date(String(this.until));
  }

  public async createRangeTime() {

    // Create the time range.
    this.range = (this.until.getTime() - this.since.getTime()) / (1000 * 3600 * 24);
    // Set the first date for the since data because the rangeOfTime has an open interval at the begining.
    this.listOfDates = [{ id: 0, date: this.since, contributors: [] }];

  }

  public async addContributorsToRangeTime() {

    if (!this.range) {
      return new AppError("Range was not called, please call createRangeTime() first!")
    }
    if (!this.listOfDates) {
      return new AppError("Range was not called, please call createRangeTime() first!")
    }

    // Request to github API to get the contributors from the repo.
    try {
      this.contributors = await axios.get(`https://api.github.com/repos/${this.user}/${this.repository}/contributors`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.GITHUB_KEY}`
          }
        }
      );
    } catch (error) {
      return error
    }

    // Iterate over the time range array.
    for (let i = 1; i <= this.range; i++) {
      // Create new date to avoid referencing the date variable.
      let refDate = new Date(this.since);
      // Add the next date from the range.
      this.listOfDates.push({ id: i, date: new Date(refDate.setDate(refDate.getDate() + i)), contributors: [] });
    }
    // Attribute the contributors to each date.
    for (let i = 0; i < this.listOfDates.length; i++) {
      // Add all contributors to each data because zero commit per day is also an indicator.
      
      this.contributors && this.contributors.data.map( contributor => {
          this.listOfDates && this.listOfDates[i].contributors?.push({ id: contributor.id, avatar_url: contributor.avatar_url, login: contributor.login, contributionsByDate: 0, commits: [] });
      });
    }
  }

  public async addCommitsToContributorsByDate() {

    if (!this.listOfDates) {
      return new AppError("Range was not called, please call createRangeTime() and addContributorsToRangeTime() first!")
    }

    // Request to github API to get all the commits from the repo.
    try {
      this.commits = await axios.get(`https://api.github.com/repos/${this.user}/${this.repository}/commits`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.GITHUB_KEY}`
          },
          params: {
            // ISOString is need by the github docs.
            since: this.since.toISOString(),
            until: this.until.toISOString()
          }
        }
      );
    } catch (error) {
      return error;
    }

    // Interate over the commits.
    if (this.commits) {
      for (const [index, commit] of this.commits.data.entries()) {
        // Iterate over the list of ranged dates.
        this.listOfDates.map((value, index) => {
          // If the date matches with the commit date.
          if (value.date.toDateString() === new Date(commit.commit.author.date).toDateString()) {
            // Find the contributor to add the commit count.
            value.contributors?.find(contributor => {
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
            // To stop iterating over the dates because the commit was found.
            return;
          }
        });
      }
      return this.listOfDates;
    } else {
      return new AppError("No commit was found", 404);
    }
  }
}
