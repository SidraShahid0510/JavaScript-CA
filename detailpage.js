document.addEventListener("DOMContentLoaded", () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const selectors = {
    shoppingCart: document.querySelector(".shopping-cart"),
    cartQty: document.querySelector(".cart-qty"),
    cartClose: document.querySelector(".cart-close"),
    cart: document.querySelector(".cart"),
    cartOverlay: document.querySelector(".cart-overlay"),
    cartBody: document.querySelector(".cart-body"),
    cartTotal: document.querySelector(".cart-total"),
    cartFooter: document.querySelector(".cart-footer"),
    clearCartBtn: document.querySelector(".cart-clear"),
  };

  const showCart = () => {
    selectors.cart.classList.add("show");
    selectors.cartOverlay.classList.add("show");
  };

  const hideCart = () => {
    selectors.cart.classList.remove("show");
    selectors.cartOverlay.classList.remove("show");
  };

  // Attach event listeners
  if (selectors.shoppingCart) {
    selectors.shoppingCart.addEventListener("click", (e) => {
      e.preventDefault();
      showCart();
    });
  }

  if (selectors.cartOverlay) {
    selectors.cartOverlay.addEventListener("click", hideCart);
  }

  if (selectors.cartClose) {
    selectors.cartClose.addEventListener("click", hideCart);
  }
  /*hamburger menu*/
  const menuIcon = document.querySelector(".menu-icon");
  const openMenu = menuIcon.querySelector(".open-menu");
  const closeMenu = menuIcon.querySelector(".close-menu");
  const navLinks = document.querySelector(".nav-links");

  closeMenu.style.display = "none";

  openMenu.addEventListener("click", () => {
    navLinks.classList.add("active");
    openMenu.style.display = "none";
    closeMenu.style.display = "block";
  });

  closeMenu.addEventListener("click", () => {
    navLinks.classList.remove("active");
    openMenu.style.display = "block";
    closeMenu.style.display = "none";
  });
  // Display single product
  const productContainer = document.querySelector(".detailPage");

  async function displaySingleProduct() {
    const productId = new URLSearchParams(window.location.search).get("id");

    try {
      const response = await fetch(
        `https://v2.api.noroff.dev/gamehub/${productId}`
      );
      const product = await response.json();

      displayProduct(product);
    } catch (error) {
      console.error("Failed to fetch product data:", error);
    }
  }

  function displayProduct(product) {
    const inCart = cart.find((x) => x.id === product.data.id);
    const text = inCart ? "Added in cart" : "Add to Cart";
    productContainer.innerHTML = `
      <div class="leftCol">
        <img src="${product.data.image.url}" alt="${product.data.title}" />
      </div>
      <div class="rightCol">
        <h1>${product.data.title}</h1>
        <h2>$ ${product.data.price}</h2>
        <h2>Description</h2>
        <p>${product.data.description}</p>
        <div class="info-section">
          <div class="genre">
            <h4>Genre</h4>
            <p>${product.data.genre}</p>
          </div>
          <div class="ageRate">
            <h4>Age Rating</h4>
            <p>${product.data.ageRating}</p>
          </div>
          <div class="released">
            <h4>Released</h4>
            <p>${product.data.released}</p>
          </div>
        </div>
        <div class="cart-btn" data-id="${product.data.id}" data-title="${product.data.title}" data-price="${product.data.price}" data-image="${product.data.image.url}" >${text}</div>
      <p class="mainPage-link"> <a href="index.html">Back to Games</a></p>
      </div>`;
  }

  // Add product to cart
  if (productContainer) {
    displaySingleProduct();
  }

  productContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("cart-btn")) {
      const productId = e.target.getAttribute("data-id");
      const productTitle = e.target.getAttribute("data-title");
      const productPrice = e.target.getAttribute("data-price");
      const productImage = e.target.getAttribute("data-image");

      const inCart = cart.find((x) => x.id === productId);
      if (!inCart) {
        const cartItem = {
          id: productId,
          title: productTitle,
          price: parseFloat(productPrice),
          image: productImage,
          quantity: 1,
        };
        cart.push(cartItem);
        e.target.textContent = "Added in cart";
        updateCartUI();
      }
    }
  });
  function saveCartToLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  function updateCartUI() {
    selectors.cartQty.textContent = cart.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    renderCartItems();
    updateCartTotal();
    saveCartToLocalStorage();
  }
  function renderCartItems() {
    selectors.cartBody.innerHTML = "";
    if (cart.length === 0) {
      selectors.cartBody.innerHTML = `<p class="empty-cart-msg">Your cart is empty now</p>`;
      selectors.cartFooter.style.display = "none";
      return;
    }

    selectors.cartFooter.style.display = "block";

    cart.forEach((item) => {
      const totalPriceForItem = item.price * item.quantity;
      const cartItemElement = document.createElement("div");
      cartItemElement.classList.add("cart-item");
      cartItemElement.innerHTML = `
        <img src="${item.image}" alt="${item.title}" />
        <div class="cart-item-detail">
          <h3>${item.title}</h3>
          <h5>$${item.price}</h5>
          <div class="cart-item-amount">
            <i class="fa-solid fa-minus" data-id="${item.id}"></i>
            <span class="qty">${item.quantity}</span>
            <i class="fa-solid fa-plus" data-id="${item.id}"></i>
            <span class="cart-item-price">Total: $${totalPriceForItem.toFixed(
              2
            )}</span>
          </div>
          <div class="remove-btn"><i class="fa-solid fa-trash-can" data-id="${
            item.id
          }"></i></div>
        </div>`;
      selectors.cartBody.appendChild(cartItemElement);
    });

    // increment and decrement event listeners
    document.querySelectorAll(".fa-plus").forEach((button) => {
      button.addEventListener("click", (e) => {
        const productId = e.target.getAttribute("data-id");
        changeQuantity(productId, 1);
      });
    });

    document.querySelectorAll(".fa-minus").forEach((button) => {
      button.addEventListener("click", (e) => {
        const productId = e.target.getAttribute("data-id");
        changeQuantity(productId, -1);
      });
    });
    document.querySelectorAll(".remove-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const productId = e.target.getAttribute("data-id");
        removeItemFromCart(productId);
      });
    });
  }

  function removeItemFromCart(productId) {
    cart = cart.filter((item) => item.id !== productId);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartUI();
  }
  if (selectors.clearCartBtn) {
    selectors.clearCartBtn.addEventListener("click", () => {
      clearCart();
      updateCartTotal();
    });
  }
  window.addEventListener("storage", (e) => {
    if (e.key === "cartCleared") {
      cart = [];
      updateCartUI();
    }
  });

  function saveCartToLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  const clearCart = () => {
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartUI();
    saveCartToLocalStorage();
    updateCartTotal();
  };

  function updateCartTotal() {
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    document.querySelector(".cart-total").textContent = `$${total.toFixed(2)}`;
  }

  const checkoutButton = document.querySelector(".checkout");
  if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
      window.location.href = "checkout.html";
    });
  }

  function changeQuantity(productId, change) {
    const item = cart.find((x) => x.id === productId);
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        removeItemFromCart(productId);
      } else {
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartUI();
        updateCartTotal();
      }
    }
  }
  updateCartUI();
  displaySingleProduct();
});
