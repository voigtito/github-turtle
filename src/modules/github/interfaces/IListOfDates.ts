import Contributor from './IContributor';

export default interface ListOfDates {
  id: number;
  date: Date;
  contributors?: Contributor[];
}