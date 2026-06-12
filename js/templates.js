function getProductTemplate(index) {
  const dish = myDishes[index];
  return `
    <section class="product_item" aria-labelledby="product_${index}_title">
      <img src="${dish.image}" srcset="${getProductImageSrcset(dish.image)}" sizes="(max-width: 912px) 315px, 207px" alt="${dish.name}" width="207" height="121" loading="lazy" decoding="async" />
      ${getProductInfoTemplate('product', 'augmentation', index, dish)}
    </section>
  `;
}

function getProductInfoTemplate(idPrefix, productType, index, dish) {
  return `
    <div class="product_item_info">
      <h3 id="${idPrefix}_${index}_title">${dish.name}</h3>
      <p>${dish.description}</p>
      <div class="product_purchase">
        <strong>${formatPrice(dish.price)}</strong>
        ${getProductPurchaseControl(productType, index, dish)}
      </div>
    </div>
  `;
}

function getProductPurchaseControl(productType, index, dish) {
  if (!dish.inBasket) {
    return getAddProductButtonTemplate(productType, index);
  }
  return `
    <div class="product_quantity product_quantity_compact" aria-label="${dish.name} Menge">
      ${getProductDecreaseControl(productType, index, dish)}
      <span>${dish.quantity}</span>
      ${getQuantityButtonTemplate(productType, index, 1, dish.name)}
    </div>
  `;
}

function getAddProductButtonTemplate(productType, index) {
  return `
    <button class="product_add_button" type="button" onclick="addProductToBasket('${productType}', ${index})">
      Add to basket
    </button>
  `;
}

function getProductDecreaseControl(productType, index, dish) {
  if (dish.quantity === 1) {
    return getDeleteButtonTemplate(productType, index, dish.name);
  }
  return getQuantityButtonTemplate(productType, index, -1, dish.name);
}

function getEnhancementProductTemplate(index) {
  const dish = enhancementDishes[index];
  return `
    <section class="product_item" aria-labelledby="enhancement_product_${index}_title">
      ${getEnhancementImagesTemplate(dish)}
      ${getProductInfoTemplate('enhancement_product', 'enhancement', index, dish)}
    </section>
  `;
}

function getEnhancementImagesTemplate(dish) {
  return `
    <div class="product_image_wrapper">
      <img class="product_image_clean" src="${dish.image}" srcset="${getProductImageSrcset(dish.image)}" sizes="(max-width: 912px) 315px, 207px" alt="${dish.name}" width="207" height="121" loading="lazy" decoding="async" />
      <img class="product_image_info" src="${dish.infoImage}" srcset="${getProductImageSrcset(dish.infoImage)}" sizes="(max-width: 912px) 315px, 420px" alt="Detailansicht ${dish.name}" width="420" height="260" loading="lazy" decoding="async" />
    </div>
  `;
}

function getImplantProductTemplate(index) {
  const dish = implantDishes[index];
  return `
    <section class="product_item" aria-labelledby="implant_product_${index}_title">
      <img src="${dish.image}" srcset="${getProductImageSrcset(dish.image)}" sizes="(max-width: 912px) 315px, 207px" alt="${dish.name}" width="207" height="121" loading="lazy" decoding="async" />
      ${getProductInfoTemplate('implant_product', 'implant', index, dish)}
    </section>
  `;
}

function getProductImageSrcset(imagePath) {
  return `${imagePath.replace('.webp', '-420.webp')} 420w, ${imagePath} 840w`;
}

function formatPrice(price) {
  return price.toLocaleString('de-DE') + ' €';
}

function formatBasketPrice(price) {
  return (
    price.toLocaleString('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + ' €'
  );
}

function getQuantityButtonTemplate(productType, index, change, productName) {
  const symbol = change > 0 ? '+' : '−';
  const action = change > 0 ? 'erhöhen' : 'verringern';
  return `<button type="button" onclick="changeProductQuantity('${productType}', ${index}, ${change})" aria-label="${productName} Menge ${action}">${symbol}</button>`;
}

function getDesktopBasketItemTemplate(basketItem) {
  const dish = basketItem.dish;
  return `
    <article class="basket_item">
      <h3>${dish.name}</h3>
      <div class="basket_item_details">
        ${getBasketQuantityTemplate(basketItem)}
        <strong>${formatBasketPrice(dish.price * dish.quantity)}</strong>
        ${getDeleteButtonTemplate(basketItem.productType, basketItem.index, dish.name)}
      </div>
    </article>
  `;
}

function getBasketQuantityTemplate(basketItem) {
  const { dish, productType, index } = basketItem;
  return `
    <div class="product_quantity product_quantity_compact" aria-label="${dish.name} Menge im Warenkorb">
      ${getQuantityButtonTemplate(productType, index, -1, dish.name)}
      <span>${dish.quantity}</span>
      ${getQuantityButtonTemplate(productType, index, 1, dish.name)}
    </div>
  `;
}

function getDesktopBasketSummary(totals) {
  return `
    ${getBasketSummaryRows(totals)}
    <p class="basket_total"><span>Gesamt</span><strong>${formatBasketPrice(totals.totalPrice)}</strong></p>
  `;
}

function getBasketSummaryRows(totals) {
  return `
    <p><span>Zwischensumme</span><strong>${formatBasketPrice(totals.subtotal)}</strong></p>
    <p><span>Lieferkosten</span><strong>${formatBasketPrice(totals.deliveryFee)}</strong></p>
  `;
}

function getEmptyDesktopBasketTemplate() {
  return '<p class="basket_empty">Dein Warenkorb ist leer.</p>';
}

function getEmptyMobileBasketTemplate() {
  return `
    <div class="mobile_basket_empty">
      <p>Hier ist noch nichts drin. Such dir ruhig dein Upgrade aus!</p>
      <img
        src="./assets/icons/screws-icon.svg"
        alt=""
        aria-hidden="true"
      />
    </div>`;
}

function getMobileBasketTemplate(basketItems, totals) {
  return `
    <div class="mobile_basket_items">${basketItems.map(getMobileBasketItemTemplate).join('')}</div>
    <div class="mobile_basket_summary">
      ${getBasketSummaryRows(totals)}
      <p class="mobile_basket_total"><span>Gesamt</span><strong>${formatBasketPrice(totals.totalPrice)}</strong></p>
    </div>
    <button class="mobile_basket_checkout_button" type="button" onclick="completeOrder()">Kaufen (${formatBasketPrice(totals.totalPrice)})</button>
  `;
}

function getMobileBasketItemTemplate(basketItem) {
  const dish = basketItem.dish;
  return `
    <article class="mobile_basket_item">
      <div class="mobile_basket_item_head"><h3>${dish.quantity} × ${dish.name}</h3></div>
      <p>${formatBasketPrice(dish.price)} pro Stück</p>
      <div class="mobile_basket_actions">
        ${getMobileBasketQuantityTemplate(basketItem)}
        <strong class="mobile_basket_item_price">${formatBasketPrice(dish.price * dish.quantity)}</strong>
      </div>
    </article>
  `;
}

function getMobileBasketQuantityTemplate(basketItem) {
  const dish = basketItem.dish;
  return `
    <div class="product_quantity product_quantity_compact" aria-label="${dish.name} Menge im Warenkorb">
      ${getMobileBasketDecreaseControl(basketItem)}
      <span>${dish.quantity}</span>
      ${getQuantityButtonTemplate(basketItem.productType, basketItem.index, 1, dish.name)}
    </div>
  `;
}

function getMobileBasketDecreaseControl(basketItem) {
  const { dish, productType, index } = basketItem;
  return dish.quantity === 1
    ? getDeleteButtonTemplate(productType, index, dish.name)
    : getQuantityButtonTemplate(productType, index, -1, dish.name);
}

function getDeleteButtonTemplate(productType, index, productName) {
  return `
    <button class="product_delete_button" type="button" onclick="removeProductFromBasket('${productType}', ${index})" aria-label="${productName} aus dem Warenkorb entfernen">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 69 14" class="delete_svg_icon bin_top">
        <path fill="black" d="M20.8232 2.62734L19.9948 4.21304C19.8224 4.54309 19.4808 4.75 19.1085 4.75H4.92857C2.20246 4.75 0 6.87266 0 9.5C0 12.1273 2.20246 14.25 4.92857 14.25H64.0714C66.7975 14.25 69 12.1273 69 9.5C69 6.87266 66.7975 4.75 64.0714 4.75H49.8915C49.5192 4.75 49.1776 4.54309 49.0052 4.21305L48.1768 2.62734C47.3451 1.00938 45.6355 0 43.7719 0H25.2281C23.3645 0 21.6549 1.00938 20.8232 2.62734ZM64.0023 20.0648C64.0397 19.4882 63.5822 19 63.0044 19H5.99556C5.4178 19 4.96025 19.4882 4.99766 20.0648L8.19375 69.3203C8.44018 73.0758 11.6746 76 15.5712 76H53.4288C57.3254 76 60.5598 73.0758 60.8062 69.3203L64.0023 20.0648Z"></path>
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 69 57" class="delete_svg_icon bin_bottom">
        <path fill="black" d="M20.8232 -16.3727L19.9948 -14.787C19.8224 -14.4569 19.4808 -14.25 19.1085 -14.25H4.92857C2.20246 -14.25 0 -12.1273 0 -9.5C0 -6.8727 2.20246 -4.75 4.92857 -4.75H64.0714C66.7975 -4.75 69 -6.8727 69 -9.5C69 -12.1273 66.7975 -14.25 64.0714 -14.25H49.8915C49.5192 -14.25 49.1776 -14.4569 49.0052 -14.787L48.1768 -16.3727C47.3451 -17.9906 45.6355 -19 43.7719 -19H25.2281C23.3645 -19 21.6549 -17.9906 20.8232 -16.3727ZM64.0023 1.0648C64.0397 0.4882 63.5822 0 63.0044 0H5.99556C5.4178 0 4.96025 0.4882 4.99766 1.0648L8.19375 50.3203C8.44018 54.0758 11.6746 57 15.5712 57H53.4288C57.3254 57 60.5598 54.0758 60.8062 50.3203L64.0023 1.0648Z"></path>
      </svg>
    </button>
  `;
}
