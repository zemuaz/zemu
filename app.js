const SUPABASE_URL =
  "https://cpwlypwlraeudehaookn.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_BaxB73FACTL2Sht9ob0ywg_qulL8OPE";

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );


// Giriş yoxlaması
async function checkUser() {

  const {
    data: {
      session
    }
  } = await supabaseClient.auth.getSession();


  // Giriş etməyibsə login səhifəsinə göndər
  if (!session) {

    window.location.href =
      "login.html";

    return false;
  }


  // Giriş edibsə mağazanı göstər
  const loading =
    document.getElementById("loading");

  const store =
    document.getElementById("store");


  if (loading) {
    loading.style.display = "none";
  }

  if (store) {
    store.style.display = "block";
  }


  return true;
}


// Səbət
let cart =
  JSON.parse(
    localStorage.getItem("zemu_cart") || "[]"
  );


function updateCart() {

  const button =
    document.getElementById("cartButton");

  if (button) {

    button.textContent =
      "🛒 " + cart.length;

  }

}


function addToCart(name, price) {

  cart.push({
    name: name,
    price: price
  });


  localStorage.setItem(
    "zemu_cart",
    JSON.stringify(cart)
  );


  updateCart();


  alert(
    name + " səbətə əlavə edildi!"
  );

}


// Məhsulları Supabase-dən gətir
async function loadProducts() {

  const container =
    document.getElementById("products");

  if (!container) return;


  const {
    data,
    error
  } = await supabaseClient
    .from("products")
    .select("*")
    .order("id", {
      ascending: false
    });


  if (error) {

    console.error(error);

    container.innerHTML =
      "<p>Məhsullar yüklənmədi.</p>";

    return;
  }


  if (!data || data.length === 0) {

    container.innerHTML =
      "<p>Hələ məhsul yoxdur.</p>";

    return;
  }


  container.innerHTML = "";


  data.forEach(product => {

    const card =
      document.createElement("div");

    card.className =
      "product";


    const image =
      product.image
        ? `<img src="${product.image}" alt="${product.name}">`
        : `<span style="font-size:60px">🛍️</span>`;


    card.innerHTML = `

      <div class="product-image">
        ${image}
      </div>

      <h3>
        ${product.name}
      </h3>

      <p class="price">
        ${Number(product.price).toFixed(2)} AZN
      </p>

      <button class="cart-btn">
        🛒 Səbətə əlavə et
      </button>

    `;


    card
      .querySelector(".cart-btn")
      .addEventListener(
        "click",
        () => {

          addToCart(
            product.name,
            product.price
          );

        }
      );


    container.appendChild(card);

  });

}


// Axtarış
const searchInput =
  document.getElementById(
    "searchInput"
  );


if (searchInput) {

  searchInput.addEventListener(
    "input",
    function() {

      const text =
        this.value
          .toLowerCase()
          .trim();


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


// Başla
async function start() {

  const loggedIn =
    await checkUser();


  if (!loggedIn) return;


  updateCart();

  loadProducts();

}


start();
