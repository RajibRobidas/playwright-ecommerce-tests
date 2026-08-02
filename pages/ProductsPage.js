class ProductsPage {
  constructor(page) {
    this.page = page;
    this.pageTitle = page.locator('.title');
    this.inventoryItems = page.locator('.inventory_item');
    this.cartLink = page.locator('.shopping_cart_link');
  }

  itemName(itemLocator) {
    return itemLocator.locator('.inventory_item_name');
  }

  itemPrice(itemLocator) {
    return itemLocator.locator('.inventory_item_price');
  }

  itemButton(itemLocator) {
    return itemLocator.locator('button');
  }

  /**
   * Dynamically scans every rendered product tile, reads its price text,
   * and returns the Locator for the tile whose price matches targetPrice
   * exactly. No product name or index is hardcoded.
   *
   * NOTE: SauceDemo can have more than one product at the same price point.
   * We deliberately return only the FIRST match (via .first()) so the
   * returned Locator always resolves to exactly one element and downstream
   * actions (click, assertions) never hit Playwright's strict-mode error.
   */
  async findItemByExactPrice(targetPrice) {
    const count = await this.inventoryItems.count();
    const matchingIndexes = [];

    for (let i = 0; i < count; i++) {
      const item = this.inventoryItems.nth(i);
      const priceText = await this.itemPrice(item).innerText(); // e.g. "$15.99"
      const priceValue = parseFloat(priceText.replace('$', ''));

      if (priceValue === targetPrice) {
        matchingIndexes.push(i);
      }
    }

    if (matchingIndexes.length === 0) {
      throw new Error(`No product found with price $${targetPrice}`);
    }

    // Return a Locator scoped to the first matching tile only.
    return this.inventoryItems.nth(matchingIndexes[0]);
  }

  async addItemToCart(itemLocator) {
    await this.itemButton(itemLocator).click();
  }

  async goToCart() {
    await this.cartLink.click();
  }
}

module.exports = { ProductsPage };
