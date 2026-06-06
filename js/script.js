function changeQuantity(quantityId, changeValue) {
  let quantityRef = document.getElementById(quantityId);
  let currentQuantity = parseInt(quantityRef.innerText);
  let newQuantity = currentQuantity + changeValue;

  if (newQuantity < 1) {
    newQuantity = 1;
  }

  if (newQuantity > 5) {
    newQuantity = 5;
  }

  quantityRef.innerText = newQuantity + 'x';
}
