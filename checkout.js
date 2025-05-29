document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const checkoutItemsContainer = document.querySelector(".checkout-items");
  const checkoutTotalContainer = document.querySelector(".checkout-total");
  const loader = document.querySelector(".loader");
  const checkoutForm = document.getElementById("checkout-form");

  let totalPrice = 0;

  // Render cart items
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
            <div>
              <h3>${item.title}</h3>
              <p>Price: $${item.price.toFixed(2)}</p>
              <p>Quantity: ${item.quantity}</p>
            </div>
            <span class="item-Total">Total: $${itemTotal.toFixed(2)}</span>
          </div>
        </div>
      `;
    });
    checkoutTotalContainer.innerHTML = `<h2>Total Amount: $${totalPrice.toFixed(
      2
    )}</h2>`;
  } else {
    checkoutItemsContainer.innerHTML = `<p>Your cart is empty.</p>`;
  }

  // Auto-format card number: 1234 5678 9012 3456
  const cardNumberInput = document.getElementById("Card-Number");
  cardNumberInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.replace(/(.{4})/g, "$1 ").trim();
    e.target.value = value;
  });

  // Auto-format expiry: MM/YY
  const expiryInput = document.getElementById("MM/YY");
  expiryInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }
    e.target.value = value;
  });

  // Form validation and order processing
  checkoutForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("Email-adress").value.trim();
    const firstName = document.getElementById("First-Name").value.trim();
    const lastName = document.getElementById("last-Name").value.trim();
    const address = document.getElementById("shipping-adress").value.trim();
    const postNumber = document.getElementById("Post-Number").value.trim();
    const city = document.getElementById("City").value.trim();
    const phone = document.getElementById("Phone-Number").value.trim();
    const cardName = document.getElementById("Name-on-Card").value.trim();
    let cardNumber = document.getElementById("Card-Number").value.trim();
    const expiry = document.getElementById("MM/YY").value.trim();
    const cvc = document.getElementById("cvc").value.trim();

    // Basic validation
    if (
      !email ||
      !firstName ||
      !lastName ||
      !address ||
      !postNumber ||
      !city ||
      !phone ||
      !cardName ||
      !cardNumber ||
      !expiry ||
      !cvc
    ) {
      alert("Please fill in all the fields.");
      return;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Card number validation
    cardNumber = cardNumber.replace(/\s+/g, "");
    if (!/^\d{12,19}$/.test(cardNumber)) {
      alert("Please enter a valid card number (12–19 digits).");
      return;
    }

    // Expiry validation (MM/YY)
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      alert("Expiry must be in MM/YY format.");
      return;
    }

    // CVC validation
    if (!/^\d{3,4}$/.test(cvc)) {
      alert("Please enter a valid CVC.");
      return;
    }

    // Show loader and simulate order completion
    loader.style.display = "block";
    setTimeout(() => {
      localStorage.removeItem("cart");
      localStorage.setItem("cartCleared", Date.now());
      window.location.href = "complete-order.html";
    }, 4000);
  });
});
