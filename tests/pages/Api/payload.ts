import { Page, Request, Response } from '@playwright/test';

export interface ServiceLog {
  url: string;
  method: string;
  status: number;
  requestHeaders: Record<string, string>;
  responseHeaders: Record<string, string>;
  requestBody: any;
  responseBody: any;
}

/**
 * ServicesPage captures network traffic during a test run.
 * Example usage:
 *   const svc = new ServicesPage(page);
 *   await svc.startNetworkCapture(3000);
 *   console.log(svc.getCapturedLogs());
 */
export default class ServicesPage {
  private readonly serviceLogs: ServiceLog[] = [];

  constructor(private readonly page: Page) {}

  async startNetworkCapture(duration = 5000): Promise<ServiceLog[]> {
    // reset previous capture
    this.serviceLogs.length = 0;

    const onRequest = (request: Request) => {
      try {
        const url = request.url();
        const method = request.method();
        const headers = request.headers();
        let body: any = null;
        try {
          body = (request as any).postDataJSON ? (request as any).postDataJSON() : request.postData();
        } catch {
          body = request.postData() || null;
        }
        this.serviceLogs.push({
          url,
          method,
          status: 0,
          requestHeaders: headers as Record<string, string>,
          responseHeaders: {},
          requestBody: body,
          responseBody: null,
        });
      } catch {
        // ignore
      }
    };

    const onResponse = async (response: Response) => {
      try {
        const url = response.url();
        const status = response.status();
        const headers = response.headers();
        const contentType = (headers['content-type'] || '').toLowerCase();
        let responseBody: any = null;
        if (contentType.includes('application/json')) {
          try {
            responseBody = await response.json();
          } catch {
            responseBody = await response.text();
          }
        } else {
          try {
            responseBody = await response.text();
          } catch {
            responseBody = null;
          }
        }

        const req = (response as any).request?.();
        const method = req?.method?.() || 'UNKNOWN';

        const match = [...this.serviceLogs].reverse().find((l) => l.url === url && l.method === method && l.status === 0);
        if (match) {
          match.status = status;
          match.responseHeaders = headers as Record<string, string>;
          match.responseBody = responseBody;
        } else {
          this.serviceLogs.push({
            url,
            method,
            status,
            requestHeaders: {},
            responseHeaders: headers as Record<string, string>,
            requestBody: null,
            responseBody,
          });
        }
      } catch {
        // ignore
      }
    };

    this.page.on('request', onRequest);
    this.page.on('response', onResponse);

    await this.page.waitForTimeout(duration);

    this.page.off('request', onRequest);
    this.page.off('response', onResponse);

    return this.serviceLogs;
  }

  getCapturedLogs(): ServiceLog[] {
    return this.serviceLogs;
  }

  filterLogsByUrl(keyword: string): ServiceLog[] {
    return this.serviceLogs.filter((l) => l.url.includes(keyword));
  }

  findLog(keyword: string): ServiceLog | undefined {
    return this.serviceLogs.find((l) => l.url.includes(keyword));
  }

  printLogs(): void {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(this.serviceLogs, null, 2));
  }
}
