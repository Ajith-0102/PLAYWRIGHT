
import { Page, expect } from '@playwright/test';

/**
 * Page object for validating order/status elements on a page.
 */
export class OrderValidationPage {
  private orderStatus: ReturnType<Page['locator']>;
  private noOrders: ReturnType<Page['locator']>;

  /**
   * Mapping of filter names to order status values.
   * @example
   * orderFilters = {
   *   'Pending': ['Awaiting action', 'Waiting'],
   *   'Processing': ['In Progress'],
   *   'Completed': ['Done', 'Finished']
   * }
   */
  public orderFilters: Record<string, string[]> = {
    'Pending': ['Awaiting action', 'Waiting'],
    'Processing': ['In Progress'],
    'Completed': ['Done', 'Finished'],
  };

  /**
   * @param page Playwright Page object
   */
  constructor(page: Page) {
    this.orderStatus = page.locator('.order-status-item'); // Update selector as needed
    this.noOrders = page.locator('.no-orders'); // Update selector as needed
  }

  /**
   * Validates that each order status item contains at least one expected filter value.
   * @param filterNames Array of filter names to validate against (e.g. ['Pending', 'Processing', 'Completed'])
   * @returns Object with validated order statuses and a message
   * @example
   * await page.validateOrderStatusContains(['Pending', 'Processing', 'Completed']);
   */
  async validateOrderStatusContains(filterNames: string[] = ['Pending', 'Processing', 'Completed']): Promise<{ statuses: string[]; message: string }> {
    const validatedStatuses: string[] = [];
    const itemCount = await this.orderStatus.count();
    if (itemCount === 0) {
      const message = await this.noOrders.textContent();
      return {
        statuses: [],
        message: `${message}`,
      };
    }

    // Flatten all expected status values for the provided filters
    const expectedValues = filterNames.flatMap((name) => this.orderFilters[name] || []);
    for (let i = 0; i < itemCount; i++) {
      const text = (await this.orderStatus.nth(i).textContent()) ?? '';
      await expect
        .soft(
          expectedValues.some((exp) => text.includes(exp)),
          `Order status '${text}' does not match any expected filter value: '${expectedValues.join(', ')}'`
        )
        .toBeTruthy();
      validatedStatuses.push(text);
    }

    return {
      statuses: validatedStatuses,
      message: 'Order validation complete',
    };
  }
}
