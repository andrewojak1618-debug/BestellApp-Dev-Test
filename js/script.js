function renderProducts() {
  renderAugmentationProducts();
  renderEnhancementProducts();
  renderImplantProducts();
  initMobileBottomNav();
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
// How TO - Hide Menu on Scroll - https://www.w3schools.com/howto/howto_js_navbar_hide_scroll.asp

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

// 1. Produkt-Container holen
// 2. Container leeren
// 3. Durch alle Produkte laufen
// 4. Für jedes Produkt HTML bauen
// 5. HTML in den Container schreiben

function changeQuantity(index, changeValue) {
  let newQuantity = myDishes[index].quantity + changeValue;

  if (newQuantity < 1) {
    newQuantity = 1;
  }

  if (newQuantity > 5) {
    newQuantity = 5;
  }

  myDishes[index].quantity = newQuantity;
  renderProducts();
}

function changeEnhancementQuantity(index, changeValue) {
  let newQuantity = enhancementDishes[index].quantity + changeValue;

  if (newQuantity < 1) {
    newQuantity = 1;
  }

  if (newQuantity > 5) {
    newQuantity = 5;
  }

  enhancementDishes[index].quantity = newQuantity;
  renderProducts();
}

// 1. Neue Stückzahl berechnen
// 2. Wenn kleiner als 1: auf 1 setzen
// 3. Wenn größer als 5: auf 5 setzen
// 4. Neue Stückzahl im Array speichern
// 5. Produkte neu anzeigen
