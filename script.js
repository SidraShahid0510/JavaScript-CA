document.addEventListener("DOMContentLoaded", () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    updateCartUI();
  }
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

  function updateCartUI() {
    selectors.cartQty.textContent = cart.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    renderCartItems();
    updateCartTotal();
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

    attachCartEventListeners();
  }

  function attachCartEventListeners() {
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

  function changeQuantity(productId, change) {
    const item = cart.find((x) => x.id === productId);
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        removeItemFromCart(productId);
      } else {
        updateCartUI();
      }
    }
  }

  function removeItemFromCart(productId) {
    cart = cart.filter((item) => item.id !== productId);
    updateCartUI();
  }

  if (selectors.clearCartBtn) {
    selectors.clearCartBtn.addEventListener("click", () => {
      clearCart();
    });
  }

  function clearCart() {
    cart = [];
    localStorage.removeItem("cart");
    updateCartUI();
    saveCartToLocalStorage();
  }
  function saveCartToLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function updateCartTotal() {
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    selectors.cartTotal.textContent = `$${total.toFixed(2)}`;
  }

  updateCartUI();
});
window.addEventListener("storage", (event) => {
  if (event.key === "cartCleared") {
    cart = [];
    updateCartUI();
  }
});

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
let productDiv = document.querySelector(".products");

/*filter to open and close catetgories*/
let categoryListDiv = document.querySelector(".categoryList");
const filterArrows = document.querySelector(".filter-arrows");
const openFilter = filterArrows.querySelector(".open-filter");
const closeFilter = filterArrows.querySelector(".close-filter");
closeFilter.style.display = "none";

openFilter.addEventListener("click", () => {
  categoryListDiv.classList.add("active");
  openFilter.style.display = "none";
  closeFilter.style.display = "block";
});
closeFilter.addEventListener("click", () => {
  categoryListDiv.classList.remove("active");
  openFilter.style.display = "block";
  closeFilter.style.display = "none";
});

let allGen = [];
let displayProduct = async (allCheckGen = []) => {
  productDiv.innerHTML = "";
  let product = await fetch("https://v2.api.noroff.dev/gamehub");
  let finalproduct = await product.json();

  if (allGen.length === 0) {
    finalproduct.data.forEach((element) => {
      if (!allGen.includes(element.genre)) {
        categoryListDiv.innerHTML += `<label for=""><input type="checkbox" onclick='categoryFilter()' value="${element.genre}" />${element.genre}</label>`;
        allGen.push(element.genre);
      }
    });
  }

  finalproduct.data.forEach((element) => {
    if (allCheckGen.length === 0 || allCheckGen.includes(element.genre)) {
      productDiv.innerHTML += `
          <div class="productItems">
            <img src="${element.image.url}" alt="${element.title}" />
            <div class="productInfo">
              <h3>${element.title}</h3>
              <a href="detailpage.html?id=${element.id}">View Detail</a>
            </div>
          </div>
        `;
    }
  });
};

displayProduct();

// Filter products based on checked categories
let categoryFilter = () => {
  let checkInput = document.querySelectorAll("input[type='checkbox']");
  let checkdata = [];
  checkInput.forEach((e) => {
    if (e.checked) {
      checkdata.push(e.value);
    }
  });
  displayProduct(checkdata);
};
