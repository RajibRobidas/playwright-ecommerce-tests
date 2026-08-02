const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { ProductsPage } = require('../pages/ProductsPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');
const { randomString, randomDigits } = require('../utils/randomData');

const STANDARD_USER = 'standard_user';
const PASSWORD = 'secret_sauce';
const TARGET_PRICE = 15.99;
const TARGET_PRICE_TEXT = `$${TARGET_PRICE.toFixed(2)}`; // "$15.99"

test.describe('SauceDemo E2E - standard_user full purchase flow', () => {
  test('login -> dynamic add to cart -> cart validation -> checkout complete', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // ---------- Step 1: Login ----------
    await loginPage.goto();
    await loginPage.login(STANDARD_USER, PASSWORD);

    // [Assertion 1] Login successful + redirected to products page
    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(productsPage.pageTitle).toHaveText('Products');

    // ---------- Step 2: Dynamic add to cart ----------
    // Scans all rendered items and returns the Locator for whichever one
    // costs exactly $15.99 — no product name or index is hardcoded.
    const targetItem = await productsPage.findItemByExactPrice(TARGET_PRICE);
    const targetItemName = await productsPage.itemName(targetItem).innerText();
    await productsPage.addItemToCart(targetItem);

    // [Assertion 2] The specific button for that item changes to "Remove"
    await expect(productsPage.itemButton(targetItem)).toHaveText('Remove');

    // ---------- Step 3: Cart validation ----------
    await productsPage.goToCart();
    await expect(page).toHaveURL(/.*cart\.html/);

    // [Assertion 3] Cart shows exactly 1 item, priced at $15.99
    await expect(cartPage.cartItems).toHaveCount(1);
    await expect(cartPage.itemName(cartPage.cartItems.first())).toHaveText(targetItemName);
    await expect(cartPage.itemPrice(cartPage.cartItems.first())).toHaveText(TARGET_PRICE_TEXT);

    // ---------- Step 4: Complete purchase ----------
    await cartPage.checkout();
    await expect(page).toHaveURL(/.*checkout-step-one\.html/);

    await checkoutPage.fillShippingInfo(
      randomString(6), // first name
      randomString(8), // last name
      randomDigits(5)  // postal code
    );

    await expect(page).toHaveURL(/.*checkout-step-two\.html/);
    await checkoutPage.finishOrder();

    await expect(page).toHaveURL(/.*checkout-complete\.html/);

    // [Assertion 4] Success message is visible
    await expect(checkoutPage.completeHeader).toBeVisible();
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });
});
