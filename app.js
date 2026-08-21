const SUPABASE_URL =
  "https://cpwlypwlraeudehaookn.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_BaxB73FACTL2Sht9ob0ywg_qulL8OPE";


const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );



/* =========================
   GİRİŞİ YOXLA
========================= */

async function startZemu() {

  const {
    data: {
      session
    }
  } =
    await supabaseClient.auth.getSession();


  if (!session) {

    window.location.replace(
      "login.html"
    );

    return;

  }


  const loading =
    document.getElementById("loading");

  const store =
    document.getElementById("store");


  if (loading) {

    loading.style.display =
      "none";

  }


  if (store) {

    store.style.display =
      "block";

  }


  loadUser();

  loadProducts();

  updateCart();

  setupAccount();

}



/* =========================
   İSTİFADƏÇİ
========================= */

async function loadUser() {

  const {
    data: {
      session
    }
  } =
    await supabaseClient.auth.getSession();


  if (!session) return;


  const email =
    session.user.email ||
    "Google istifadəçisi";


  const userEmail =
    document.getElementById(
      "userEmail"
    );


  if (userEmail) {

    userEmail.textContent =
      email;

  }

}



/* =========================
   ŞƏXSİ KABİNET
========================= */

function setupAccount() {

  const accountButton =
    document.getElementById(
      "accountButton"
    );


  const accountPanel =
    document.getElementById(
      "accountPanel"
    );


  const logoutButton =
    document.getElementById(
      "logoutButton"
    );


  if (!accountButton ||
      !accountPanel ||
      !logoutButton) {

    return;

  }


  accountButton.addEventListener(
    "click",
    function() {

      if (
        accountPanel.style.display ===
        "none"
      ) {

        accountPanel.style.display =
          "block";

      } else {

        accountPanel.style.display =
          "none";

      }

    }
  );


  logoutButton.addEventListener(
    "click",
    async function() {

      logoutButton.textContent =
        "Çıxış edilir...";


      const {
        error
      } =
        await supabaseClient.auth.signOut();


      if (error) {

        alert(
          "Çıxış zamanı xəta baş verdi."
        );

        logoutButton.textContent =
          "🚪 Çıxış et";

        return;

      }


      window.location.replace(
        "login.html"
      );

    }
  );

}



/* =========================
   MƏHSULLAR
========================= */

async function loadProducts() {

  const products =
    document.getElementById(
      "products"
    );


  if (!products) return;


  const {
    data,
    error
  } =
    await supabaseClient
      .from("products")
      .select("*")
      .order(
        "id",
        {
          ascending: false
        }
      );


  if (error) {

    console.error(error);

    products.innerHTML =
      "<p>Məhsullar yüklənmədi.</p>";

    return;

  }


  if (
    !data ||
    data.length === 0
  ) {

    products.innerHTML =
      "<p>Hələ məhsul yoxdur.</p>";

    return;

  }


  products.innerHTML = "";


  data.forEach(
    function(product) {

      const card =
        document.createElement(
          "div"
        );


      card.className =
        "product";


      let imageHTML;


      if (product.image) {

        imageHTML =
          `
          <img
            src="${product.image}"
            alt="${product.name}"
          >
          `;

      } else {

        imageHTML =
          `
          <span
            style="
              font-size:60px;
            "
          >
            🛍️
          </span>
          `;

      }


      card.innerHTML =
        `

        <div class="product-image">

          ${imageHTML}

        </div>


        <h3>
          ${product.name}
        </h3>


        <p class="price">
          ${Number(
            product.price
          ).toFixed(2)} AZN
        </p>


        <button
          class="cart-btn"
        >
          🛒 Səbətə əlavə et
        </button>

        `;


      const cartButton =
        card.querySelector(
          ".cart-btn"
        );


      cartButton.addEventListener(
        "click",
        function() {

          addToCart(
            product.name,
            product.price
          );

        }
      );


      products.appendChild(
        card
      );

    }
  );

}



/* =========================
   SƏBƏT
========================= */

let cart =
  JSON.parse(
    localStorage.getItem(
      "zemu_cart"
    ) || "[]"
  );



function addToCart(
  name,
  price
) {

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
    name +
    " səbətə əlavə edildi!"
  );

}



function updateCart() {

  const button =
    document.getElementById(
      "cartButton"
    );


  if (button) {

    button.textContent =
      "🛒 " +
      cart.length;

  }

}



/* =========================
   AXTARIŞ
========================= */

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


      const products =
        document.querySelectorAll(
          ".product"
        );


      products.forEach(
        function(product) {

          const name =
            product
              .querySelector("h3")
              .textContent
              .toLowerCase();


          if (
            name.includes(text)
          ) {

            product.style.display =
              "";

          } else {

            product.style.display =
              "none";

          }

        }
      );

    }
  );

}



/* =========================
   MAĞAZAYA KEÇ
========================= */

const shopButton =
  document.querySelector(
    ".shop-btn"
  );


if (shopButton) {

  shopButton.addEventListener(
    "click",
    function() {

      const products =
        document.getElementById(
          "products"
        );


      if (products) {

        products.scrollIntoView({
          behavior: "smooth"
        });

      }

    }
  );

}



/* =========================
   BAŞLAT
========================= */

startZemu();
