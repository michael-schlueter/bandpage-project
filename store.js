// The functions are only executed on the page when the HTML ended up loading to make sure that all elements are available
if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}

function ready() {
  // Adds an Event Listener to all Remove Buttons
  let removeCartItemButtons = document.getElementsByClassName("btn-danger");
  for (let i = 0; i < removeCartItemButtons.length; i++) {
    let button = removeCartItemButtons[i];
    button.addEventListener("click", removeCartItem);
  }

  // Add an Event Listener for changing the quantity of a cart-item
  let cartQuantityInputs = document.getElementsByClassName(
    "cart-quantity-input"
  );
  for (let i = 0; i < cartQuantityInputs.length; i++) {
    let cartQuantityInput = cartQuantityInputs[i];
    cartQuantityInput.addEventListener("change", quantityChange);
  }

  // Add an Event Listener to the Add-to-cart Buttons
  let addToCartButtons = document.getElementsByClassName("shop-item-button");
  for (let i = 0; i < addToCartButtons.length; i++) {
    let addToCartButton = addToCartButtons[i];
    addToCartButton.addEventListener("click", addToCartClicked);
  }

  // Add an Event Listener to remove all items out of the cart after purchasing
  document.getElementsByClassName('btn-purchase')[0].addEventListener('click', emptyCart);
}

// Removes Items from the cart
function removeCartItem(event) {
  let buttonClicked = event.target;
  buttonClicked.parentElement.parentElement.remove();
  updateCartTotal();
}

// Check the changed input for validity and update the cart total based on the changes made
function quantityChange(event) {
  let input = event.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1; // automatically sets the value of the input to 1 if the input is invalid
  }
  updateCartTotal();
}

// Select the relevant information to add an item to the cart
function addToCartClicked(event) {
  let buttonClicked = event.target;
  let shopItem = buttonClicked.parentElement.parentElement;
  let title = shopItem.getElementsByClassName("shop-item-title")[0].innerText;
  let price = shopItem.getElementsByClassName("shop-item-price")[0].innerText;
  let imageSrc = shopItem.getElementsByClassName("shop-item-image")[0].src; // select the src attribute of the image
  addItemToCart(title, price, imageSrc);
  updateCartTotal();
}

// Add an item to the cart
function addItemToCart(title, price, imageSrc) {
  // Create the element to put in the information about the added cart item
  let cartRow = document.createElement("div");
  // Add the relevant classes to the created element to make sure styling etc. applies
  cartRow.classList.add('cart-row');
  // Select the container to append the element
  let cartItems = document.getElementsByClassName("cart-items")[0];
  // Check if the cart item which is about to be added is already in the cart and warn the user
  let cartItemNames = cartItems.getElementsByClassName("cart-item-title");
  for (let i = 0; i < cartItemNames.length; i++) {
    if (cartItemNames[i].innerText == title) {
      alert("You have already added this item to the cart!");
      return;
    }
  }
  // The HTML code you want to append to the element
  cartRowContents = `
        <div class="cart-column cart-item">
        <img class="cart-item-image" ${imageSrc} width="100" height="100">
        <span class="cart-item-title">${title}</span>
    </div>
    <span class="cart-price cart-column">${price}</span>
    <div class="cart-column cart-quantity">
        <input class="cart-quantity-input" type="number" value="1">
        <button class="btn btn-danger" role="button">REMOVE</button>
    </div>`;
  // Fill the element with the content
  cartRow.innerHTML = cartRowContents;
  cartItems.append(cartRow);
  // It is necessary to add these Event Listeners now because they were added AFTER the page was already loaded
  cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem); 
  cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('click', quantityChange);
}

// Updates the total price of the cart once elements are either added or removed or the quantity is changed
function updateCartTotal() {
  let cartItemContainer = document.getElementsByClassName("cart-items")[0]; // returns an array of all elements with the class, but we want only one (important even if there is only one element in the array to select the relevant element, otherwise you just select the array)
  let cartRows = cartItemContainer.getElementsByClassName("cart-row"); // calling this method on an object will only get the elements inside that object --> not necessary in this case?!
  let total = 0;
  for (let i = 0; i < cartRows.length; i++) {
    let cartItem = cartRows[i];
    let priceElement = cartItem.getElementsByClassName("cart-price")[0];
    let quantityElement = cartItem.getElementsByClassName(
      "cart-quantity-input"
    )[0];
    let price = parseFloat(priceElement.innerText.replace("$", "")); // converts the string into a number with decimal points
    let quantity = quantityElement.value;
    total = total + price * quantity;
  }
  total = Math.round(total * 100) / 100; // round the total to the nearest 2 decimal places to avoid rounding inaccuracies in JS
  document.getElementsByClassName(
    "cart-total-price"
  )[0].innerText = `$${total}`;
}

// Emptying the cart by removing all child elements from the cart-row container after purchasing
function emptyCart(event) {
    alert('Thank you for your purchase!');
    let cartRowContainer = document.getElementsByClassName('cart-items')[0];
    // The loop runs as long as the container has child elements
    while (cartRowContainer.hasChildNodes()) {
        // Removes the first child of the element
        cartRowContainer.removeChild(cartRowContainer.firstChild);
    }
}
