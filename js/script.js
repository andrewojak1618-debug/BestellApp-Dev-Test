function renderProducts() {
  renderAugmentationProducts();
  renderEnhancementProducts();
  renderImplantProducts();
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





