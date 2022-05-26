import { Params } from "@feathersjs/feathers";
import { Service, KnexServiceOptions } from "feathers-knex";
import { Application } from "../../declarations";
import { hashSecret, verifySecret } from "../../utils/hashing";

export class Votes extends Service {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<KnexServiceOptions>, app: Application) {
    super({
      ...options,
      name: "votes",
    });
  }

  async create(data: any, params: Params) {
    const { voterId, voterSecret } = data;

    if (!(voterId && voterSecret)) {
      throw new Error("voterId and voterSecret is required");
    }

    const hashedVoterSecret = hashSecret(voterSecret);

    const updatedData = {
      ...data,
      voterSecret: hashedVoterSecret,
    };

    return super.create(updatedData, params);
  }

  async remove(id: string, params: Params) {
    const { voterId, voterSecret } = params.query || {};

    if (!(voterId && voterSecret)) {
      throw new Error(
        "voterId and voterSecret is required as query parameters"
      );
    }

    const vote = await this.get(id);
    const { voterId: storedVoterId, voterSecret: storedVoterSecretHash } = vote;

    if (
      voterId === storedVoterId &&
      verifySecret(voterSecret, storedVoterSecretHash)
    ) {
      return super.remove(id);
    } else {
      throw new Error("Invalid voterId or voterSecret");
    }
  }
}
