// example.page.ts
import { expect, Page } from '@playwright/test';
import { ExampleModel } from './example.model';

/**
 * Page class that provides high-level actions for interacting with the
 * Selenium Playground using the ExampleModel Page Object.
 */
export class ExamplePage {
  /** Page object model containing locators for elements on the playground */
  private model: ExampleModel;

  /**
   * Constructs the ExamplePage and initializes the ExampleModel.
   * @param page The Playwright Page object
   */
  constructor(private page: Page) {
    this.model = new ExampleModel(page);
  }

  /**
   * Navigates to the Selenium Playground URL defined in the model.
   */
  async navigate_to(): Promise<void> {
    await this.page.goto(this.model.url);
  }

  /**
   * Clicks on a menu item (link) by its visible text.
   * @param menuText The visible text of the menu item
   */
  async click_menu(menuText: string): Promise<void> {
    await this.model.getLinkByText(menuText).click();
  }

  /**
   * Clicks a button by its visible text.
   * @param buttonText The text displayed on the button
   */
  async click_button(buttonText: string): Promise<void> {
    await this.model.getButtonByText(buttonText).click();
  }

  /**
   * Fills a textbox identified by its label with the given value.
   * @param label The visible label or name of the textbox
   * @param value The text to input into the field
   */
  async fill_textbox(label: string, value: string): Promise<void> {
    await this.model.getInputByLabel(label).fill(value);
  }

  /**
   * Fills the "Name" field using the predefined locator in the model.
   * @param value The name to enter
   */
  async fill_textboxname(value: string): Promise<void> {
    await this.model.nameInput.fill(value);
  }

  /**
   * Fills the "Message"/"Description" field using the predefined locator in the model.
   * @param value The message or description text to enter
   */
  async fill_textboxdescription(value: string): Promise<void> {
    await this.model.messageInput.fill(value);
  }

  /**
   * Verifies that the page title matches the expected string (case-insensitive).
   * @param expected The expected title or pattern to match
   */
  async verify_title(expected: string): Promise<void> {
    await expect(this.page).toHaveTitle(new RegExp(expected, 'i'));
  }

  /**
   * Verifies that a given text is visible on the page.
   * @param text The text to look for on the page
   */
  async verify_text_visible(text: string): Promise<void> {
    await expect(this.model.getText(text)).toBeVisible();
  }
}
