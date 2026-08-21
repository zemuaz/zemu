// Zemu.az - əsas JavaScript

let cart = [];

// Səhifə açıldıqda səbəti yaddaşdan götür
const savedCart = localStorage.getItem("zemu_cart");

if (savedCart) {
  cart = JSON.parse(savedCart);
}

// Səbəti yadda saxla
function saveCart() {
  localStorage.setItem("zemu_cart", JSON.stringify(cart));
}

// Səbət sayını göstər
function updateCartCount() {
  const cartButton = document.querySelector(".header-icons button:nth-child(3)");

  if (!cartButton) return;

  cartButton.innerHTML = `🛒 ${cart.length}`;
}

// Məhsulu səbətə əlavə et
function addToCart(name, price) {
  const product = {
    id: Date.now(),
    name: name,
    price: price
  };

  cart.push(product);

  saveCart();
  updateCartCount();

  alert(`${name} səbətə əlavə edildi!`);
}

// Məhsul düymələrini aktivləşdir
document.querySelectorAll(".product").forEach((product) => {

  const name = product.querySelector("h3").textContent;
  const price = product.querySelector(".price").textContent;
  const button = product.querySelector(".cart-btn");

  button.addEventListener("click", () => {
    addToCart(name, price);
  });

});

// Axtarış
const searchInput = document.querySelector(".search input");

if (searchInput) {

  searchInput.addEventListener("input", function () {

    const searchText = this.value.toLowerCase();

    document.querySelectorAll(".product").forEach((product) => {

      const productName =
        product.querySelector("h3").textContent.toLowerCase();

      if (productName.includes(searchText)) {
        product.style.display = "";
      } else {
        product.style.display = "none";
      }

    });

  });

}

// "İndi alış-veriş et" düyməsi
const shopButton = document.querySelector(".shop-btn");

if (shopButton) {

  shopButton.addEventListener("click", () => {

    document.querySelector(".products").scrollIntoView({
      behavior: "smooth"
    });

  });

}

// Səhifə yüklənəndə səbət sayını göstər
updateCartCount();
