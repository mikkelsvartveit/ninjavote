import assert from "assert";
import app from "../../src/app";

describe("'votes' service", () => {
  it("registered the service", () => {
    const service = app.service("votes");

    assert.ok(service, "Registered the service");
  });
});
