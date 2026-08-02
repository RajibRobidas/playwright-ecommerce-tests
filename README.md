# SauceDemo Playwright E2E - Appifylab QA Assessment

## Project Structure
```
saucedemo-playwright/
├── pages/                  # Page Object Model classes (locators + actions)
│   ├── LoginPage.js
│   ├── ProductsPage.js
│   ├── CartPage.js
│   └── CheckoutPage.js
├── utils/
│   └── randomData.js       # random string/digit generators for checkout form
├── tests/
│   └── e2e.spec.js         # the single continuous E2E test
├── playwright.config.js
└── package.json
```

## Setup (run once, from this folder)

```bash
npm install
npx playwright install
```

The first command installs `@playwright/test`. The second downloads the
browser binaries (Chromium/Firefox) that Playwright drives.

## Run the tests

```bash
npx playwright test
```

Run headed (see the browser):
```bash
npx playwright test --headed
```

Run a single file:
```bash
npx playwright test tests/e2e.spec.js
```

View the HTML report after a run:
```bash
npx playwright show-report
```

## What the test covers
1. Logs in as `standard_user` and asserts redirection to `/inventory.html`.
2. Dynamically scans every product tile's price (no hardcoded name/index) to
   find the item priced exactly `$15.99`, adds it to the cart, and asserts
   its button changes to "Remove".
3. Opens the cart and asserts exactly 1 item is present at `$15.99`.
4. Fills the checkout form with randomly generated strings and completes the
   order, asserting the final "Thank you for your order!" message.

No `page.waitForTimeout()` or static delays are used anywhere — all
assertions are Playwright's auto-retrying web-first assertions
(`expect(locator).toHaveText(...)`, `toHaveURL(...)`, `toBeVisible()`, etc.).
