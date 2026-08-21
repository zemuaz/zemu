const SUPABASE_URL =
  "https://cpwlypwlraeudehaookn.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_BaxB73FACTL2Sht9ob0ywg_qulL8OPE";

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );


let cart =
  JSON.parse(
    localStorage.getItem("zemu_cart") || "[]"
  );


async function loadProducts() {

  const container =
    document.getElementById("products");

  container.innerHTML =
    "<p class='loading'>Məhsullar yüklənir...</p>";


  const { data, error } =
    await supabaseClient
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
      "<p>Hələ məhsul əlavə edilməyib.</p>";

    return;
  }


  container.innerHTML = "";


  data.forEach(product => {

    const card =
      document.createElement("div");

    card.className = "product";


    const image =
      product.image
        ? `<img src="${product.image}" alt="${product.name}">`
        : `<span style="font-size:60px;">🛍️</span>`;


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
      "🛒 " + cart.length;

  }

}


const searchInput =
  document.getElementById(
    "searchInput"
  );


if (searchInput) {

  searchInput.addEventListener(
    "input",
    function () {

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


const shopButton =
  document.querySelector(
    ".shop-btn"
  );


if (shopButton) {

  shopButton.addEventListener(
    "click",
    () => {

      document
        .getElementById("products")
        .scrollIntoView({
          behavior: "smooth"
        });

    }
  );

}


updateCart();

loadProducts();
