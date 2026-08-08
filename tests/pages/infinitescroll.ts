import { expect, Page } from "@playwright/test";

/**
 * Page object for handling infinite scroll functionality.
 */
export class InfiniteScrollPage {
    /**
     * Constructs the model by binding locators to the given Playwright page instance.
     * @param page The Playwright Page object
     */
    constructor(private page: Page) { }

    /**
     * Validates and collects all visible records from an infinite scroll container.
     * @returns An object containing an array of collected record texts.
     */
    async collectAllRecordsFromInfiniteScroll(): Promise<{
        records: string[];
    }> {
        const records: string[] = [];
        const scrollContainer = this.page.locator('div.scrollable-div');
        const seenIndices = new Set<number>();
        const totalText = await scrollContainer.textContent();
        const totalRecords = parseInt(totalText || "0", 10);

        while (true) {
            const items = this.page.locator("div[style*='position: absolute']");
            const itemCount = await items.count();
            const styleAttrr = await items.nth(1).getAttribute('style');
            const matchr = styleAttrr?.match(/top:\s*(\d+)px/);
            const step = matchr ? parseInt(matchr[1], 10) : 0;

            for (let i = 0; i < itemCount; i++) {
                const styleAttr = await items.nth(i).getAttribute('style');
                const match = styleAttr?.match(/top:\s*(\d+)px/);
                if (match) {
                    const matchvalue = matchr ? parseInt(matchr[1], 10) : 0;
                    const rowIndex = Math.round(matchvalue / step); // 100 is a generic divisor, adjust as needed
                    if (!seenIndices.has(rowIndex)) {
                        seenIndices.add(rowIndex);
                        const text = (await items.nth(i).innerText()).trim() || '';
                        records.push(text);
                    }
                }
            }       

//c.clientHeight = height of the viewport of the scrollable div (the window you can see at once).
//c.scrollHeight = total content height inside that scrollable div.
//c.scrollTop = how far you’ve scrolled down from the top.
            await scrollContainer.evaluate((el) => {
                const c = el as HTMLElement;
                c.scrollTop += c.scrollHeight; // 100 is a generic scroll step, adjust as needed
                c.dispatchEvent(new Event('scroll', { bubbles: true }));
            });
            const lastTop = Math.max(...Array.from(seenIndices));

            await scrollContainer.evaluate((el, lastTop) => {
                el.scrollTo({top: lastTop, behavior: "auto"});
                el.dispatchEvent(new Event('scroll', { bubbles: true }));
            }, lastTop);

            await this.page.waitForTimeout(200);

            if (seenIndices.size >= totalRecords) {
                break;
            }
        }

        return {
            records,
        };
    }
}
