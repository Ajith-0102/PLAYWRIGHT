import { Given, When, Then } from "@cucumber/cucumber";
import { expect, request, APIRequestContext, Page } from "@playwright/test";
import { APIPage } from "../../pages/Api/Api.page";
import { CustomWorld } from "@support/custom-world";
let page: Page;
let apiPage: APIPage;
let apiContext: APIRequestContext;
let apiResponse: any;
let uiDetails: any;
let statusCode: number;
let serviceUrl: string;
let responseStatus: number;
let apiUrl: string;


When("user creates the url", async function () {
  // Example API endpoint (replace with your config/base url)
  apiUrl = "https://jsonplaceholder.typicode.com/users/1";
});

// ✅ Hit GET request
When("user hit {string} http request for URL", async function (method: string) {
  apiContext = await request.newContext();

  let response;
  switch (method.toUpperCase()) {
    case "GET":
      response = await apiContext.get(apiUrl);
      break;
    default:
      throw new Error(`Unsupported method: ${method}`);
  }

  responseStatus = response.status();
});

When("user validates the status as {string}", async function (expectedStatus: string) {
  expect(responseStatus.toString()).toBe(expectedStatus);
});

let apiResult: Record<string, any>;

When("user calls GET {string}", async function (this: CustomWorld, endpoint: string) {
  apiContext = await request.newContext();
  apiPage = new APIPage(this.page);

  apiResult = await apiPage.runGetTests(
    "BookingService",          // apiName
    "GetBookingDetails",       // apiTestPoint
    apiContext,                // Playwright context
    endpoint                   // request URL
  );

  console.log("API Result:", apiResult);
});

When("user authenticates with basic auth", async function () {

  await apiPage.authenticateWithBasicAuth("myUser", "myPass");
});

When("user authenticates with oauth token", async function () {

  await apiPage.authenticateWithBearerToken("my-oauth-access-token");
});

When("user authenticates with api key", async function () {

  await apiPage.authenticateWithApiKey("x-api-key", "my-secret-api-key");
});

When("user authenticates with client credentials", async function () {
  await apiPage.authenticateWithClientCredentials(
    "https://example.com/oauth/token",
    "my-client-id",
    "my-client-secret",
    "read write"
  );
});

When("user hits {string} request to {string}", async function (method: string, url: string) {
  await apiPage.hitRequest(method, url);
});

Then("user should see status code {int}", async function (expected: number) {
  expect(apiPage.getStatus()).toBe(expected);
  this.attach(`Status code is ${apiPage.getStatus()}`);
});


