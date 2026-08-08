# Playwright Test Automation Project

## Overview

This project uses [Playwright](https://playwright.dev/) for end-to-end testing of web applications. It is structured to provide maintainable, scalable, and robust automated tests using the Page Object Model (POM) pattern.

## Project Architecture

### 1. **Directory Structure**

```
d:\PLAYWRIGHT
│
├── tests/
│   ├── pages/
│   │   └── infinitescroll.ts
│   ├── specs/
│   │   └── ...test files...
│   └── utils/
│       └── ...helper files...
├── playwright.config.ts
├── package.json
└── README.md
```

- **tests/pages/**: Contains Page Object classes. Each class encapsulates selectors and actions for a specific page or component.
- **tests/specs/**: Contains test specifications. Each file includes test cases for a feature or user flow.
- **tests/utils/**: Contains utility functions and helpers for tests.
- **playwright.config.ts**: Playwright configuration file for test settings, browser options, and reporting.
- **package.json**: Project dependencies and scripts.

### 2. **Page Object Model (POM)**

- Each page/component is represented by a class (e.g., `InfiniteScrollPage`).
- Page Objects encapsulate selectors and methods for interacting with UI elements.
- This abstraction improves test readability and maintainability.

**Example:**
```typescript
// tests/pages/infinitescroll.ts
export class InfiniteScrollPage {
    constructor(private page: Page) { }
    async collectAllRecordsFromInfiniteScroll(): Promise<{ records: string[] }> {
        // Implementation...
    }
}
```

### 3. **Test Specifications**

- Test files import Page Objects and use their methods to perform actions and assertions.
- Tests are organized by feature or user flow.

**Example:**
```typescript
import { test, expect } from '@playwright/test';
import { InfiniteScrollPage } from '../pages/infinitescroll';

test('Validate infinite scroll loads all records', async ({ page }) => {
    const infiniteScroll = new InfiniteScrollPage(page);
    const result = await infiniteScroll.collectAllRecordsFromInfiniteScroll();
    expect(result.records.length).toBeGreaterThan(0);
});
```

### 4. **Utilities**

- Common functions (e.g., data generation, API helpers) are placed in `tests/utils/`.

### 5. **Configuration**

- `playwright.config.ts` manages browser settings, test retries, timeouts, and reporting.
- Environment variables can be used for sensitive data or environment-specific settings.

## How to Run Tests

1. **Install dependencies:**
   ```
   npm install
   ```
2. **Install playwright dependencies:**
  ```
  npx playwright install
  ```

3. **Run all tests:**
   ```
   npx playwright test
   ```

4. **View test report:**
   ```
   npx playwright show-report
   ```

## Extending the Project

- Add new Page Object classes for additional pages/components.
- Create new test files in `tests/specs/` for new features.
- Use utilities for common logic to keep tests DRY.

## Contributing

- Follow the POM pattern for new pages.
- Write clear, maintainable
