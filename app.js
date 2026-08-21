const SUPABASE_URL =
  "https://cpwlypwlraeudehaookn.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_BaxB73FACTL2Sht9ob0ywg_qulL8OPE";


const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );


/* GİRİŞ YOXLAMASI */

async function startZemu() {

  try {

    const {
      data: {
        session
      }
    } =
      await supabaseClient.auth.getSession();


    if (!session) {

      window.location.href =
        "login.html";

      return;

    }


    document.getElementById(
      "loading"
    ).style.display = "none";


    document.getElementById(
      "store"
    ).style.display = "block";


    loadProducts();

    updateCart();

  } catch (error) {

    console.error(error);

  }

}


/* MƏHSULLAR */

async function loadProducts() {

  const container =
    document.getElementById(
      "products"
    );


  if (!container) return;


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

    container.innerHTML =
      "<p>Məhsullar yüklənmədi.</p>";

    return;

  }


  if (
    !data ||
    data.length === 0
  ) {

    container.innerHTML =
      "<p>Hələ məhsul yoxdur.</p>";

    return;

  }


  container.innerHTML = "";


  data.forEach(
    function(product) {

      const card =
        document.createElement(
          "div"
        );


      card.className =
        "product";


      const image =
        product.image
          ?
          `<img
             src="${product.image}"
             alt="${product.name}"
           >`
          :
          `<span
             style="font-size:60px"
           >
             🛍️
           </span>`;


      card.innerHTML = `

        <div class="product-image">

          ${image}

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


      card
        .querySelector(
          ".cart-btn"
        )
        .addEventListener(
          "click",
          function() {

            addToCart(
              product.name,
              product.price
            );

          }
        );


      container.appendChild(
        card
      );

    }
  );

}


/* SƏBƏT */

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

    button.innerHTML =
      `
      <span>🛒</span>
      <small>Səbət ${cart.length}</small>
      `;

  }

}


/* AXTARIŞ */

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
        .querySelectorAll(
          ".product"
        )
        .forEach(
          function(product) {

            const name =
              product
                .querySelector("h3")
                .textContent
                .toLowerCase();


            product.style.display =
              name.includes(text)
                ? ""
                : "none";

          }
        );

    }
  );

}


/* MAĞAZAYA GETİR */

const shopButton =
  document.querySelector(
    ".shop-btn"
  );


if (shopButton) {

  shopButton.addEventListener(
    "click",
    function() {

      document
        .getElementById("products")
        .scrollIntoView({
          behavior: "smooth"
        });

    }
  );

}


/* BAŞLAT */

startZemu();
