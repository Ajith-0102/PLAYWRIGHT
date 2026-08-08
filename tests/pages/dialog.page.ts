import { Page } from '@playwright/test';

/**
 * Page object for handling dialog interactions (alert, confirm, prompt, custom modal).
 */
export class DialogPage {
	constructor(private page: Page) {}

	/**
	 * Handles browser alert dialog and returns its message.
	 */
	async handleAlertDialog(): Promise<string> {
		let dialogMessage = '';
		this.page.once('dialog', async dialog => {
			dialogMessage = dialog.message();
			await dialog.accept();
		});
		// Trigger alert on the page (customize selector/action)
		await this.page.click('#show-alert');
		return dialogMessage;
	}

	/**
	 * Handles browser confirm dialog and returns its message.
	 * Accepts or dismisses based on the accept parameter.
	 */
	async handleConfirmDialog(accept = true): Promise<string> {
		let dialogMessage = '';
		this.page.once('dialog', async dialog => {
			dialogMessage = dialog.message();
			if (accept) {
				await dialog.accept();
			} else {
				await dialog.dismiss();
			}
		});
		await this.page.click('#show-confirm');
		return dialogMessage;
	}

	/**
	 * Handles browser prompt dialog, enters text, and returns its message.
	 */
	async handlePromptDialog(inputText: string): Promise<string> {
		let dialogMessage = '';
		this.page.once('dialog', async dialog => {
			dialogMessage = dialog.message();
			await dialog.accept(inputText);
		});
		await this.page.click('#show-prompt');
		return dialogMessage;
	}

	/**
	 * Opens a custom modal dialog (not browser native) and returns its text.
	 */
	async openCustomModal(): Promise<string> {
		await this.page.click('#open-modal');
		const modal = this.page.locator('.modal-dialog');
		await modal.waitFor({ state: 'visible' });
		return await modal.textContent() ?? '';
	}

	/**
	 * Closes a custom modal dialog.
	 */
	async closeCustomModal(): Promise<void> {
		await this.page.click('.modal-dialog .close');
		await this.page.locator('.modal-dialog').waitFor({ state: 'hidden' });
	}

	/**
	 * Gets the message text from a custom modal dialog.
	 */
	async getCustomModalMessage(): Promise<string> {
		return await this.page.locator('.modal-dialog .modal-message').textContent() ?? '';
	}
}
