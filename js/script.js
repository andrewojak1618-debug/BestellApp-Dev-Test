function renderProducts() {
  renderAugmentationProducts();
  renderEnhancementProducts();
  renderImplantProducts();
  initMobileBottomNav();
  updateBasketCount();
  renderDesktopBasket();
  renderMobileBasket();
}

function getProductGroup(productType) {
  let productGroups = {
    augmentation: myDishes,
    enhancement: enhancementDishes,
    implant: implantDishes,
  };

  return productGroups[productType];
}

function getBasketItems() {
  let basketItems = [];

  for (let productType of ['augmentation', 'enhancement', 'implant']) {
    let productGroup = getProductGroup(productType);

    for (let index = 0; index < productGroup.length; index++) {
      if (productGroup[index].inBasket) {
        basketItems.push({
          productType,
          index,
          dish: productGroup[index],
        });
      }
    }
  }

  return basketItems;
}

function addProductToBasket(productType, index) {
  let dish = getProductGroup(productType)[index];
  dish.inBasket = true;
  dish.quantity = 1;
  renderProducts();
}

function removeProductFromBasket(productType, index) {
  let dish = getProductGroup(productType)[index];
  dish.inBasket = false;
  dish.quantity = 1;
  renderProducts();
}

function changeProductQuantity(productType, index, changeValue) {
  let dish = getProductGroup(productType)[index];
  let newQuantity = dish.quantity + changeValue;

  if (newQuantity < 1) {
    newQuantity = 1;
  }

  if (newQuantity > 5) {
    newQuantity = 5;
  }

  dish.quantity = newQuantity;
  renderProducts();
}

function getBasketTotals() {
  let subtotal = 0;

  for (let basketItem of getBasketItems()) {
    subtotal += basketItem.dish.price * basketItem.dish.quantity;
  }

  let deliveryFee = subtotal > 0 ? 5.9 : 0;

  return {
    subtotal,
    deliveryFee,
    totalPrice: subtotal + deliveryFee,
  };
}

function updateBasketCount() {
  let mobileBasketButton = document.querySelector('.mobile_basket_button');

  if (!mobileBasketButton) {
    return;
  }

  let productCount = getBasketItems().reduce((total, basketItem) => {
    return total + basketItem.dish.quantity;
  }, 0);

  mobileBasketButton.textContent = productCount > 0
    ? `Warenkorb (${productCount})`
    : 'Warenkorb';
}

function getDesktopBasketItemTemplate(basketItem) {
  let dish = basketItem.dish;

  return `
    <article class="basket_item">
      <h3>${dish.name}</h3>
      <div class="basket_item_details">
        <div class="product_quantity product_quantity_compact" aria-label="${dish.name} Menge im Warenkorb">
          <button type="button" onclick="changeProductQuantity('${basketItem.productType}', ${basketItem.index}, -1)" aria-label="${dish.name} Menge verringern">−</button>
          <span>${dish.quantity}</span>
          <button type="button" onclick="changeProductQuantity('${basketItem.productType}', ${basketItem.index}, 1)" aria-label="${dish.name} Menge erhöhen">+</button>
        </div>
        <strong>${formatBasketPrice(dish.price * dish.quantity)}</strong>
        ${getDeleteButtonTemplate(basketItem.productType, basketItem.index, dish.name)}
      </div>
    </article>
  `;
}

function renderDesktopBasket() {
  let basketItemsContainer = document.querySelector('.basket_items');
  let basketSummary = document.querySelector('.basket_summary');
  let basketCheckoutButton = document.querySelector('.basket_checkout_button');

  if (!basketItemsContainer || !basketSummary || !basketCheckoutButton) {
    return;
  }

  let basketItems = getBasketItems();

  basketItemsContainer.innerHTML = basketItems.length > 0
    ? basketItems.map(getDesktopBasketItemTemplate).join('')
    : '<p class="basket_empty">Dein Warenkorb ist leer.</p>';

  let totals = getBasketTotals();
  basketSummary.innerHTML = `
    <p><span>Zwischensumme</span><strong>${formatBasketPrice(totals.subtotal)}</strong></p>
    <p><span>Lieferkosten</span><strong>${formatBasketPrice(totals.deliveryFee)}</strong></p>
    <p class="basket_total"><span>Gesamt</span><strong>${formatBasketPrice(totals.totalPrice)}</strong></p>
  `;
  basketCheckoutButton.disabled = basketItems.length === 0;
}

function openMobileBasket() {
  let mobileBasket = document.querySelector('.mobile_basket');

  if (mobileBasket) {
    mobileBasket.hidden = false;
  }
}

function closeMobileBasket() {
  let mobileBasket = document.querySelector('.mobile_basket');

  if (mobileBasket) {
    mobileBasket.hidden = true;
  }
}

function getMobileBasketDecreaseControl(basketItem) {
  if (basketItem.dish.quantity === 1) {
    return getDeleteButtonTemplate(basketItem.productType, basketItem.index, basketItem.dish.name);
  }

  return `<button type="button" onclick="changeProductQuantity('${basketItem.productType}', ${basketItem.index}, -1)" aria-label="${basketItem.dish.name} Menge verringern">−</button>`;
}
function getMobileBasketItemTemplate(basketItem) {
  let dish = basketItem.dish;

  return `
    <article class="mobile_basket_item">
      <div class="mobile_basket_item_head">
        <h3>${dish.quantity} × ${dish.name}</h3>
      </div>
      <p>${formatBasketPrice(dish.price)} pro Stück</p>
      <div class="mobile_basket_actions">
        <div class="product_quantity product_quantity_compact" aria-label="${dish.name} Menge im Warenkorb">
          ${getMobileBasketDecreaseControl(basketItem)}
          <span>${dish.quantity}</span>
          <button type="button" onclick="changeProductQuantity('${basketItem.productType}', ${basketItem.index}, 1)" aria-label="${dish.name} Menge erhöhen">+</button>
        </div>
        <strong class="mobile_basket_item_price">${formatBasketPrice(dish.price * dish.quantity)}</strong>
      </div>
    </article>
  `;
}

function renderMobileBasket() {
  let mobileBasketContent = document.querySelector('.mobile_basket_content');

  if (!mobileBasketContent) {
    return;
  }

  let basketItems = getBasketItems();

  if (basketItems.length === 0) {
    mobileBasketContent.innerHTML = '<p class="mobile_basket_empty">Dein Warenkorb ist leer.</p>';
    return;
  }

  let totals = getBasketTotals();

  mobileBasketContent.innerHTML = `
    <div class="mobile_basket_items">
      ${basketItems.map(getMobileBasketItemTemplate).join('')}
    </div>
    <div class="mobile_basket_summary">
      <p><span>Zwischensumme</span><strong>${formatBasketPrice(totals.subtotal)}</strong></p>
      <p><span>Lieferkosten</span><strong>${formatBasketPrice(totals.deliveryFee)}</strong></p>
      <p class="mobile_basket_total"><span>Gesamt</span><strong>${formatBasketPrice(totals.totalPrice)}</strong></p>
    </div>
    <button class="mobile_basket_checkout_button" type="button">Jetzt kaufen (${formatBasketPrice(totals.totalPrice)})</button>
  `;
}

function initMobileBottomNav() {
  let mobileBottomNav = document.querySelector('.mobile_bottom_nav');

  if (!mobileBottomNav || mobileBottomNav.dataset.scrollReady) {
    return;
  }

  let lastScrollPosition = window.scrollY;
  mobileBottomNav.dataset.scrollReady = 'true';

  window.addEventListener(
    'scroll',
    () => {
      let currentScrollPosition = window.scrollY;
      let isScrollingUp = currentScrollPosition < lastScrollPosition;
      let isAtPageBottom =
        window.innerHeight + currentScrollPosition >=
        document.documentElement.scrollHeight - 2;

      mobileBottomNav.classList.toggle(
        'mobile_bottom_nav_fixed',
        isScrollingUp && !isAtPageBottom,
      );
      lastScrollPosition = currentScrollPosition;
    },
    { passive: true },
  );
}

function renderAugmentationProducts() {
  let productsContentRef = document.getElementById('products_content');
  productsContentRef.innerHTML = '';

  for (let index = 0; index < myDishes.length; index++) {
    productsContentRef.innerHTML += getProductTemplate(index);
  }
}

function renderEnhancementProducts() {
  let enhancementsContentRef = document.getElementById('enhancements_content');
  enhancementsContentRef.innerHTML = '';

  for (let index = 0; index < enhancementDishes.length; index++) {
    enhancementsContentRef.innerHTML += getEnhancementProductTemplate(index);
  }
}

function renderImplantProducts() {
  let implantsContentRef = document.getElementById('implants_content');
  implantsContentRef.innerHTML = '';

  for (let index = 0; index < implantDishes.length; index++) {
    implantsContentRef.innerHTML += getImplantProductTemplate(index);
  }
}
