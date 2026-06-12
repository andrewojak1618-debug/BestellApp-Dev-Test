// Rendert Produkte, Warenkörbe und abhängige User Interface-Bereiche neu.
// Re-renders products, shopping carts, and dependent user interface areas
function renderProducts() {
  updateViewportWidth();
  renderAugmentationProducts();
  renderEnhancementProducts();
  renderImplantProducts();
  initMobileBottomNav();
  updateBasketCount();
  renderDesktopBasket();
  renderMobileBasket();
  initOrderConfirmation();
}

// Speichert die nutzbare Viewportbreite als CSS-Variable für volle Balkenbreiten.
// Stores the usable viewport width as a CSS variable for full bar widths.
function updateViewportWidth() {
  const viewportWidth = document.documentElement.clientWidth;
  document.documentElement.style.setProperty(
    '--viewport-width',
    `${viewportWidth}px`,
  );
}

// Liefert die passende Produktliste für eine Produktkategorie.
// Provides the appropriate product list for a product category.
function getProductGroup(productType) {
  const productGroups = {
    augmentation: myDishes,
    enhancement: enhancementDishes,
    implant: implantDishes,
  };
  return productGroups[productType];
}

// Sammelt alle aktuell im Warenkorb liegenden Produkte.
// Collects all products currently in the shopping cart.
function getBasketItems() {
  return ['augmentation', 'enhancement', 'implant'].flatMap((productType) =>
    getProductGroup(productType)
      .map((dish, index) => ({ productType, index, dish }))
      .filter((basketItem) => basketItem.dish.inBasket),
  );
}

// Fügt ein Produkt hinzu und aktualisiert die Ansicht.
// Adds a product and refreshes the view.
function addProductToBasket(productType, index) {
  const dish = getProductGroup(productType)[index];
  dish.inBasket = true;
  dish.quantity = 1;
  renderProducts();
}

// Entfernt ein Produkt vollständig aus dem Warenkorb.
// Removes a product completely from the shopping cart.
function removeProductFromBasket(productType, index) {
  const dish = getProductGroup(productType)[index];
  dish.inBasket = false;
  dish.quantity = 1;
  renderProducts();
}

// Ändert die Produktmenge innerhalb der erlaubten Grenzen.
// Changes the amount of product within the allowed limits.
function changeProductQuantity(productType, index, changeValue) {
  const dish = getProductGroup(productType)[index];
  dish.quantity = Math.min(5, Math.max(1, dish.quantity + changeValue));
  renderProducts();
}

// Berechnet Zwischensumme, Lieferkosten und Gesamtpreis.
// Calculates subtotal, delivery cost and total price.
function getBasketTotals() {
  const subtotal = getBasketItems().reduce(getBasketItemTotal, 0);
  const deliveryFee = subtotal > 0 ? 5.9 : 0;
  return {
    subtotal,
    deliveryFee,
    totalPrice: subtotal + deliveryFee,
  };
}

// Addiert den Preis eines Warenkorb-Eintrags zur laufenden Summe.
// Adds the price of a shopping cart entry to the running total.
function getBasketItemTotal(total, basketItem) {
  return total + basketItem.dish.price * basketItem.dish.quantity;
}

// Aktualisiert Badge, Titel und Screenreader-Text des mobilen Warenkorbs.
// Updated the badge, title and screen reader text of the mobile shopping cart.
function updateBasketCount() {
  const mobileBasketButton = document.querySelector('.mobile_basket_button');
  const basketCountBadge = document.querySelector('.mobile_basket_count');
  if (!mobileBasketButton || !basketCountBadge) {
    return;
  }
  const productCount = getBasketItems().reduce(getBasketQuantity, 0);
  const buttonText = getBasketButtonText(productCount);
  mobileBasketButton.setAttribute('aria-label', buttonText);
  mobileBasketButton.title = buttonText;
  basketCountBadge.textContent = productCount;
  basketCountBadge.hidden = productCount === 0;
}

// Addiert die Menge eines Warenkorb-Eintrags zur Gesamtanzahl.
// Adds the quantity of a shopping cart entry to the total number.
function getBasketQuantity(total, basketItem) {
  return total + basketItem.dish.quantity;
}

// Erzeugt den passenden Button-Text je nach Warenkorbmenge.
// Creates the appropriate button text depending on the shopping cart quantity.
function getBasketButtonText(productCount) {
  return productCount > 0 ? `Warenkorb (${productCount})` : 'Warenkorb';
}

// Rendert den Desktop-Warenkorb und steuert den Kaufen-Button.
// Renders the desktop shopping cart and controls the buy button.
function renderDesktopBasket() {
  const elements = getDesktopBasketElements();
  if (!elements) {
    return;
  }
  const basketItems = getBasketItems();
  elements.items.innerHTML = getDesktopBasketContent(basketItems);
  elements.summary.innerHTML = getDesktopBasketSummary(getBasketTotals());
  elements.checkout.disabled = basketItems.length === 0;
}

// Sammelt die benötigten DOM-Elemente für den Desktop-Warenkorb.
// Collects the required DOM elements for the desktop shopping cart.
function getDesktopBasketElements() {
  const items = document.querySelector('.basket_items');
  const summary = document.querySelector('.basket_summary');
  const checkout = document.querySelector('.basket_checkout_button');
  if (!items || !summary || !checkout) {
    return null;
  }
  return { items, summary, checkout };
}

// Wählt zwischen gefülltem und leerem Desktop-Warenkorb-Template.
// Choose between filled and empty desktop shopping cart template.
function getDesktopBasketContent(basketItems) {
  return basketItems.length > 0
    ? basketItems.map(getDesktopBasketItemTemplate).join('')
    : getEmptyDesktopBasketTemplate();
}

// Öffnet den mobilen Warenkorb-Dialog.
// Opens the mobile shopping cart dialog.
function openMobileBasket() {
  setMobileBasketHidden(false);
}

// Schließt den mobilen Warenkorb-Dialog.
// Closes the mobile shopping cart dialog.
function closeMobileBasket() {
  setMobileBasketHidden(true);
}

// Setzt den Sichtbarkeitszustand des mobilen Warenkorbs.
// Sets the visibility state of the mobile shopping cart.
function setMobileBasketHidden(isHidden) {
  const mobileBasket = document.querySelector('.mobile_basket');
  if (mobileBasket) {
    mobileBasket.hidden = isHidden;
  }
}

// Rendert den Inhalt des mobilen Warenkorbs passend zum Warenkorbstatus.
// Renders the contents of the mobile cart to match the cart status.
function renderMobileBasket() {
  const mobileBasketContent = document.querySelector('.mobile_basket_content');
  if (!mobileBasketContent) {
    return;
  }
  const basketItems = getBasketItems();
  if (basketItems.length === 0) {
    mobileBasketContent.innerHTML = getEmptyMobileBasketTemplate();
    return;
  }
  mobileBasketContent.innerHTML = getMobileBasketTemplate(
    basketItems,
    getBasketTotals(),
  );
}

// Schließt den Kauf ab, leert den Warenkorb und zeigt die Bestätigung.
// Complete the purchase, empty the cart and show the confirmation.
function completeOrder() {
  if (getBasketItems().length === 0) {
    return;
  }
  clearBasket();
  closeMobileBasket();
  renderProducts();
  openOrderConfirmation();
}

// Leert alle Produktgruppen im Warenkorb.
// Empties all product groups in the shopping cart.
function clearBasket() {
  ['augmentation', 'enhancement', 'implant'].forEach(clearProductGroup);
}

// Setzt alle Produkte einer Kategorie zurück.
// Resets all products in a category.
function clearProductGroup(productType) {
  getProductGroup(productType).forEach(resetProductBasketState);
}

// Entfernt den Warenkorbstatus und setzt die Menge eines Produkts zurück.
// Removes the cart status and resets the quantity of a product.
function resetProductBasketState(dish) {
  dish.inBasket = false;
  dish.quantity = 1;
}

// Öffnet die Bestellbestätigung und setzt den Fokus auf den Schließen-Button.
// Open the order confirmation and focus on the close button.
function openOrderConfirmation() {
  const overlay = document.querySelector('.order_confirmation_overlay');
  if (!overlay) {
    return;
  }
  overlay.hidden = false;
  overlay.querySelector('.order_confirmation_close').focus();
}

// Schließt die Bestellbestätigung.
// Closes the order confirmation.
function closeOrderConfirmation() {
  const overlay = document.querySelector('.order_confirmation_overlay');
  if (overlay) {
    overlay.hidden = true;
  }
}

// Schließt die Bestätigung nur bei Klick auf den Overlay-Hintergrund.
// Closes the confirmation only when clicking on the overlay background.
function closeOrderConfirmationFromOverlay(event) {
  if (event.target === event.currentTarget) {
    closeOrderConfirmation();
  }
}

// Aktiviert die Tastatursteuerung für die Bestellbestätigung einmalig.
// Activates the keyboard control for order confirmation once.
function initOrderConfirmation() {
  const overlay = document.querySelector('.order_confirmation_overlay');
  if (!overlay || overlay.dataset.keyboardReady) {
    return;
  }
  overlay.dataset.keyboardReady = 'true';
  document.addEventListener('keydown', handleConfirmationKeydown);
}

// Schließt die Bestellbestätigung mit der Escape-Taste.
// Close the order confirmation with the escape key.
function handleConfirmationKeydown(event) {
  const overlay = document.querySelector('.order_confirmation_overlay');
  if (event.key === 'Escape' && overlay && !overlay.hidden) {
    closeOrderConfirmation();
  }
}

// Aktiviert das Scrollverhalten der mobilen Bottom-Navigation einmalig.
// Activates the scrolling behavior of the mobile bottom navigation once.
function initMobileBottomNav() {
  const mobileBottomNav = document.querySelector('.mobile_bottom_nav');
  if (!mobileBottomNav || mobileBottomNav.dataset.scrollReady) {
    return;
  }
  mobileBottomNav.dataset.scrollReady = 'true';
  mobileBottomNav.dataset.lastScrollPosition = window.scrollY;
  window.addEventListener('scroll', handleMobileNavScroll, { passive: true });
}

// Blendet die mobile Bottom-Navigation beim Hochscrollen fixiert ein.
// Displays the mobile bottom navigation when scrolling up.
function handleMobileNavScroll() {
  const mobileBottomNav = document.querySelector('.mobile_bottom_nav');
  const lastPosition = Number(mobileBottomNav.dataset.lastScrollPosition);
  const isScrollingUp = window.scrollY < lastPosition;
  mobileBottomNav.classList.toggle(
    'mobile_bottom_nav_fixed',
    isScrollingUp && !isAtPageBottom(),
  );
  mobileBottomNav.dataset.lastScrollPosition = window.scrollY;
}

// Prüft, ob der Nutzer fast am Seitenende angekommen ist.
// Checks whether the user has almost reached the bottom of the page.
function isAtPageBottom() {
  return (
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 2
  );
}

// Rendert die Augmentierungen in ihren Produktcontainer.
// Renders the augmentations to your product container.
function renderAugmentationProducts() {
  renderProductGroup('products_content', myDishes, getProductTemplate);
}

// Rendert die Enhancements in ihren Produktcontainer.
// Renders the enhancements to your product container.
function renderEnhancementProducts() {
  renderProductGroup(
    'enhancements_content',
    enhancementDishes,
    getEnhancementProductTemplate,
  );
}

// Rendert die Implantate in ihren Produktcontainer.
// Renders the implants into their product container.
function renderImplantProducts() {
  renderProductGroup(
    'implants_content',
    implantDishes,
    getImplantProductTemplate,
  );
}

// Rendert eine Produktgruppe mit dem übergebenen Template.
// Renders a product group with the template passed.
function renderProductGroup(containerId, products, getTemplate) {
  const container = document.getElementById(containerId);
  container.innerHTML = products
    .map((product, index) => getTemplate(index))
    .join('');
}

window.addEventListener('resize', updateViewportWidth);
