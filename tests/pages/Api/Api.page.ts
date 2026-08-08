import { Page, request } from "@playwright/test";
import { APIRequestContext, APIResponse } from "@playwright/test";
type JSONType = Record<string, any>;

export class APIPage {
  private apiContext: APIRequestContext | null = null;
  private lastResponse: APIResponse | null = null;
  constructor(private page: Page) {}


async runGetTests(
  apiName: string,
  apiTestPoint: string,
  apiRequest: APIRequestContext,
  requestUrl: string
): Promise<JSONType> {
  const startTime: number = new Date().getTime();

  // Hit API
  const apiBody: APIResponse = await apiRequest.get(requestUrl, { ignoreHTTPSErrors: true });

  let apiJson: JSONType | null = null;
  if (apiBody.status() !== 204) {
    try {
      apiJson = await apiBody.json();
    } catch {
      apiJson = null; // fallback if body is not JSON
    }
  }

  const endTime: number = new Date().getTime();
  const testTime: number = endTime - startTime;
  const statusCode: number = apiBody.status();

  const addedData: JSONType = {
    APIAppID: "APIID:4314",
    APICategory: apiName,
    APIEndPointName: apiTestPoint,
    TestTime: testTime,
    StatusCode: statusCode,
  };

  // ✅ Only spread apiJson if it’s a valid object
  const combinedData: JSONType = {
    ...addedData,
    ...(apiJson && typeof apiJson === "object" ? apiJson : {}),
  };

  return combinedData;
}

// ✅ Init context with optional headers
  async init(headers: Record<string, string> = {}) {
    this.apiContext = await request.newContext({
      extraHTTPHeaders: headers,
    });
  }

  // ✅ Basic Authentication
  async authenticateWithBasicAuth(username: string, password: string) {
    this.apiContext = await request.newContext({
      httpCredentials: {
        username,
        password,
      },
    });
  }

  // ✅ Bearer Token (OAuth 2.0)
  async authenticateWithBearerToken(token: string) {
    this.apiContext = await request.newContext({
      extraHTTPHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // ✅ API Key (passed in header)
  async authenticateWithApiKey(headerName: string, apiKey: string) {
    this.apiContext = await request.newContext({
      extraHTTPHeaders: {
        [headerName]: apiKey,
      },
    });
  }

  // ✅ Client ID + Client Secret (Client Credentials flow)
  async authenticateWithClientCredentials(
    tokenUrl: string,
    clientId: string,
    clientSecret: string,
    scope: string = ""
  ) {
    // First get access token
    const tempContext = await request.newContext();
    const tokenResponse = await tempContext.post(tokenUrl, {
      form: {
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
        scope: scope,
      },
    });

    if (tokenResponse.status() !== 200) {
      throw new Error(`Failed to fetch token: ${tokenResponse.status()}`);
    }

    const tokenJson = await tokenResponse.json();
    const accessToken = tokenJson.access_token;

    // Store context with bearer token
    this.apiContext = await request.newContext({
      extraHTTPHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  // ✅ Generic request handler
  async hitRequest(method: string, url: string, body: any = {}): Promise<APIResponse> {
    if (!this.apiContext) {
      await this.init(); // fallback without auth
    }

    let response: APIResponse;

    switch (method.toUpperCase()) {
      case "GET":
        response = await this.apiContext!.get(url);
        break;
      case "POST":
        response = await this.apiContext!.post(url, { data: body });
        break;
      case "PUT":
        response = await this.apiContext!.put(url, { data: body });
        break;
      case "DELETE":
        response = await this.apiContext!.delete(url);
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }

    this.lastResponse = response;
    return response;
  }

  // ✅ Get response status
  getStatus(): number {
    if (!this.lastResponse) {
      throw new Error("No response available. Call hitRequest() first.");
    }
    return this.lastResponse.status();
  }

  // ✅ Get response body
  async getResponseBody<T = any>(): Promise<T> {
    if (!this.lastResponse) {
      throw new Error("No response available. Call hitRequest() first.");
    }
    try {
      return await this.lastResponse.json();
    } catch {
      return (await this.lastResponse.text()) as unknown as T;
    }
  }

}
