// checkout.js

document.addEventListener("DOMContentLoaded", () => {
  // Retrieve the cart data from localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const checkoutItemsContainer = document.querySelector(".checkout-items");
  const checkoutTotalContainer = document.querySelector(".checkout-total");
  const placeOrderBtn = document.querySelector(".checkout-complete-btn");
  const loader = document.querySelector(".loader");
  let totalPrice = 0;

  // If there are items in the cart, display them
  if (cart.length > 0) {
    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      totalPrice += itemTotal;
      checkoutItemsContainer.innerHTML += `         
      <div class="checkout-item">
            <div class="checkout-Image"><img src="${item.image}" alt="${
        item.title
      }" /></div>
            <div class="checkout-item-details">
              <div><h3>${item.title}</h3>
              <p>Price: $${item.price.toFixed(2)}</p>
              <p>Quantity: ${item.quantity}</p></div>
              <span class="item-Total">Total: $${itemTotal.toFixed(2)}</span>
            </div>
          </div>
        `;
    });
    checkoutTotalContainer.innerHTML = `<h2>Total Amount: $${totalPrice.toFixed(
      2
    )}</h2>`;
  } else {
    // Show a message if the cart is empty
    checkoutItemsContainer.innerHTML = `<p>Your cart is empty.</p>`;
  }
  placeOrderBtn?.addEventListener("click", () => {
    loader.style.display = "block";

    setTimeout(() => {
      localStorage.removeItem("cart");
      localStorage.setItem("cartCleared", Date.now());
      window.location.href = "completeorder.html";
    }, 4000);
  });
  document
    .querySelector(".checkout-complete-btn")
    ?.addEventListener("click", () => {
      localStorage.removeItem("cart");
      localStorage.setItem("cartCleared", Date.now());
      window.location.href = "completeorder.html";
    });
});
