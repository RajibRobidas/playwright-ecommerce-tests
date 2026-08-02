class CartPage {
  constructor(page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('#checkout');
  }

  itemName(itemLocator) {
    return itemLocator.locator('.inventory_item_name');
  }

  itemPrice(itemLocator) {
    return itemLocator.locator('.inventory_item_price');
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}

module.exports = { CartPage };
