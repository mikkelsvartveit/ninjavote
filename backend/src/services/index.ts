import { Application } from '../declarations';
import polls from './polls/polls.service';
import options from './options/options.service';
import votes from './votes/votes.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.configure(polls);
  app.configure(options);
  app.configure(votes);
}
