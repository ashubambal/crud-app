const request = require("supertest");
const app = require("../app"); // assuming app.js exports your Express app

describe("CRUD App", () => {
  it("should return 200 OK on GET /", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
  });
});
