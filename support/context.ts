// Import the CustomWorld type which includes Playwright context and page for each scenario
import type { CustomWorld } from './custom-world';

/**
 * Validates that the CustomWorld has both the `page` and `context` initialized.
 * This ensures that any step or helper using the world won't break due to missing setup.
 *
 * @param world - The CustomWorld instance injected into Cucumber steps.
 * @throws Error if the `page` or `context` is not initialized.
 */
export function init(world: CustomWorld): void {
  if (!world.page || !world.context) {
    throw new Error('❌ CustomWorld is not initialized with page and context. Make sure this is done in the Before hook.');
  }
}

/**
 * Returns the Playwright `BrowserContext` from the CustomWorld.
 * 
 * @param world - The CustomWorld instance for the current scenario.
 * @returns The Playwright `BrowserContext`.
 * @throws Error if context is not available (ensures safe access).
 */
export function getContext(world: CustomWorld) {
  if (!world.context) {
    throw new Error('❌ BrowserContext is not available in CustomWorld.');
  }
  return world.context;
}

/**
 * Returns the Playwright `Page` instance from the CustomWorld.
 * 
 * @param world - The CustomWorld instance for the current scenario.
 * @returns The Playwright `Page` instance.
 * @throws Error if page is not available (ensures safe access).
 */
export function getPage(world: CustomWorld) {
  if (!world.page) {
    throw new Error('❌ Page is not available in CustomWorld.');
  }
  return world.page;
}
