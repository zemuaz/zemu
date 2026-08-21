// Zemu.az - Supabase bağlantısı

const SUPABASE_URL = "https://cpwlypwlraeudehaookn.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_BaxB73FACTL2Sht9ob0ywg_qulL8OPE";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);


// ==========================
// MƏHSULLARI GƏTİR
// ==========================

async function loadProducts() {

  const productsContainer =
    document.querySelector(".products");

  if (!productsContainer) return;

  productsContainer.innerHTML =
    "<p>Məhsullar yüklənir...</p>";

  const { data, error } = await supabaseClient
    .from("products")
    .select("*")
    .order("id", { ascending: false });

  if (error) {

    console.error("Supabase xətası:", error);

    productsContainer.innerHTML =
      "<p>Məhsullar yüklənərkən xəta baş verdi.</p>";

    return;
  }

  if (!data || data.length === 0) {

    productsContainer.innerHTML =
      "<p>Hələ məhsul yoxdur.</p>";

    return;
  }

  productsContainer.innerHTML = "";

  data.forEach(product => {

    const card = document.createElement("div");

    card.className = "product";

    card.innerHTML = `

      <div class="product-image">

        ${
          product.image
            ? `<img
                src="${product.image}"
                alt="${product.name}"
                style="
                  width:100%;
                  height:100%;
                  object-fit:cover;
                  border-radius:10px;
                "
              >`
            : "🛍️"
        }

      </div>

      <h3>${product.name}</h3>

      <p class="price">
        ${Number(product.price).toFixed(2)} AZN
      </p>

      <button class="cart-btn">
        🛒 Səbətə əlavə et
      </button>

    `;

    const button =
      card.querySelector(".cart-btn");

    button.addEventListener("click", () => {

      addToCart(
        product.name,
        product.price
      );

    });

    productsContainer.appendChild(card);

  });

}


// ==========================
// SƏBƏT
// ==========================

let cart = JSON.parse(
  localStorage.getItem("zemu_cart") || "[]"
);


function addToCart(name, price) {

  cart.push({
    name: name,
    price: price
  });

  localStorage.setItem(
    "zemu_cart",
    JSON.stringify(cart)
  );

  updateCartCount();

  alert(
    `${name} səbətə əlavə edildi!`
  );

}


// ==========================
// SƏBƏT SAYI
// ==========================

function updateCartCount() {

  const buttons =
    document.querySelectorAll(
      ".header-icons button"
    );

  if (buttons.length >= 3) {

    buttons[2].textContent =
      `🛒 ${cart.length}`;

  }

}


// ==========================
// AXTARIŞ
// ==========================

const searchInput =
  document.querySelector(".search input");


if (searchInput) {

  searchInput.addEventListener(
    "input",
    function () {

      const text =
        this.value.toLowerCase().trim();

      document
        .querySelectorAll(".product")
        .forEach(product => {

          const name =
            product
              .querySelector("h3")
              .textContent
              .toLowerCase();

          product.style.display =
            name.includes(text)
              ? ""
              : "none";

        });

    }
  );

}


// ==========================
// ALIŞ-VERİŞ DÜYMƏSİ
// ==========================

const shopButton =
  document.querySelector(".shop-btn");


if (shopButton) {

  shopButton.addEventListener(
    "click",
    () => {

      const products =
        document.querySelector(".products");

      if (products) {

        products.scrollIntoView({
          behavior: "smooth"
        });

      }

    }
  );

}


// ==========================
// BAŞLA
// ==========================

updateCartCount();

loadProducts();
