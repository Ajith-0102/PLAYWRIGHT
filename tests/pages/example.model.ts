import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for the LambdaTest Selenium Playground form page.
 * Provides access to all key form elements and utility methods to locate elements dynamically.
 */
export class ExampleModel {
  /** URL of the Selenium Playground page */
  public url: string;

  /** Link to open the 'Input Form Submit' section */
  private inputFormSubmitLink: Locator;

  /** Input field for user's name (labelled as "title") */
  public nameInput: Locator;

  /** Input field for user's email */
  private emailInput: Locator;

  /** Input field for password */
  private passwordInput: Locator;

  /** Input field for company name */
  private companyInput: Locator;

  /** Input field for website URL */
  private websiteInput: Locator;

  /** Dropdown select element for choosing a country */
  private countrySelect: Locator;

  /** Input field for city */
  private cityInput: Locator;

  /** Input field for address line 1 */
  private address1Input: Locator;

  /** Input field for address line 2 */
  private address2Input: Locator;

  /** Input field for state */
  private stateInput: Locator;

  /** Input field for ZIP/postal code */
  private zipInput: Locator;

  /** Submit button for the form */
  private submitButton: Locator;

  /** Message or description textarea field */
  public messageInput: Locator;

  /**
   * Constructs the model by binding locators to the given Playwright page instance.
   * @param page The Playwright Page object
   */
  constructor(private page: Page) {



    
    this.url = 'https://www.lambdatest.com/selenium-playground/'; // Form page URL
    this.inputFormSubmitLink = page.locator('a:has-text("Input Form Submit")');
    this.nameInput = page.locator('[name="title"]');
    this.messageInput = page.locator('//*[@id="description"]');
    this.emailInput = page.locator('[name="email"]');
    this.passwordInput = page.locator('[name="password"]');
    this.companyInput = page.locator('[name="company"]');
    this.websiteInput = page.locator('[name="website"]');
    this.countrySelect = page.locator('[name="country"]');
    this.cityInput = page.locator('[name="city"]');
    this.address1Input = page.locator('[name="address_line1"]');
    this.address2Input = page.locator('[name="address_line2"]');
    this.stateInput = page.locator('[name="state"]');
    this.zipInput = page.locator('[name="zip"]');
    this.submitButton = page.locator('button[type="submit"]');
  }

  /**
   * Get a link element on the page by its visible text.
   * Useful for generic link interactions.
   * @param linkText The visible text of the link
   * @returns The Playwright Locator for the link
   */
  getLinkByText(linkText: string): Locator {
    return this.page.getByRole('link', { name: linkText });
  }

  /**
   * Get a button element on the page by its visible text.
   * @param buttonText The text of the button
   * @returns The Playwright Locator for the button
   */
  getButtonByText(buttonText: string): Locator {
    return this.page.getByRole('button', { name: buttonText });
  }

  /**
   * Get a textbox input field by its label name.
   * Note: Falls back to textbox role since some forms use placeholders instead of label elements.
   * @param label The label text of the input field
   * @returns The Playwright Locator for the textbox
   */
  getInputByLabel(label: string): Locator {
    return this.page.getByRole('textbox', { name: label });
  }

  /**
   * Get any element that contains the specified visible text.
   * @param text The visible text to match
   * @returns The Playwright Locator for the text
   */
  getText(text: string): Locator {
    return this.page.getByText(text);
  }
}
