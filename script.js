let drinks_items = [];
let cart_items = [];

let selected_item = {};

async function fetchDrinksItem() {
  function dataTransformer(item) {
    return {
      id: item.idDrink,
      name: item.strDrink,
      category: item.strGlass,
      instructions: item.strInstructions,
      imageUrl: item.strDrinkThumb,
      alcoholic: item.strAlcoholic,
    };
  }

  return fetch("https://www.thecocktaildb.com/api/json/v1/1/search.php?f=m")
    .then((r) => r.json())
    .then((data) => {
      drinks_items = data.drinks.map(dataTransformer);
    });
}
function addToCartHandler() {
  document.querySelectorAll(".add-cart-btn").forEach(function (item) {
    item.addEventListener("click", function () {
      let id = item.getAttribute("id");
      if (cart_items.includes(id)) return;

      if (cart_items.length >= 7) {
        alert("You can only add upto 7");
        return;
      }
      if (!cart_items.includes(id)) cart_items.push(id);

      renderCartItems();
      updateCartCounter();
      start();
    });
  });
}
function searchHandler() {
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");

  searchBtn.addEventListener("click", function () {
    const key = searchInput.value;
    if (!key) return;
  });
}
function updateCartCounter() {
  document.getElementById("cartCounter").innerHTML = cart_items.length;
}

// on details button click handler
function detailsHandler() {
  document.querySelectorAll(".details-btn").forEach(function (item) {
    item.addEventListener("click", function () {
      let id = item.getAttribute("data-id");
      selected_item = drinks_items.find((i) => i.id == id);
      renderModalData();
      openModal();
    });
  });
}

function renderDrinksItems() {
  const cardContainer = document.querySelector("#card_container");
  const renderAbleHtml = drinks_items
    .map((item) => generateSingleDrinksItem(item))
    .join("");
  cardContainer.innerHTML = renderAbleHtml;

  function generateSingleDrinksItem(item) {
    const { id, name, category, instructions, imageUrl } = item;

    return `
    <div class="col drink_item" id="drink_item_${id}" data-id="${id}" >
              <div class="card h-100">
                <img src="${imageUrl}" class="card-img-top drink-item-image" alt="Drink Image" />
                <div class="card-body">
                  <h5 class="card-title">Name: ${name}</h5>
                  <p class="card-text">Category: ${category}</p>
                  <p class="card-text text-truncate">
                    ${instructions}
                  </p>
                  
                  <button class="btn ${
                    cart_items.includes(id.toString())
                      ? "btn-danger"
                      : "btn-outline-secondary"
                  } btn-sm add-cart-btn" id="${id}">
                    ${
                      cart_items.includes(id.toString())
                        ? "Already selected"
                        : "Add To Cart"
                    } 
                  </button>
                  <button class="btn btn-outline-secondary btn-sm float-end details-btn" data-id="${id}">
                    Details
                  </button>
                </div>
              </div>
            </div>
    `;
  }
}

function openModal() {
  const modal = new bootstrap.Modal(document.getElementById("drinkModal"), {
    keyboard: false,
  });
  modal.show();
}

function renderModalData() {
  document.getElementById("drinkModalLabel").innerHTML = selected_item.name;

  document.getElementById("drinkModalAlcoholic").innerHTML =
    selected_item.alcoholic;
  document.getElementById("drinkModalCategory").innerHTML =
    selected_item.category;
  document.getElementById("drinkModalInstructions").innerHTML =
    selected_item.instructions;
}

function renderCartItems() {
  const cartItemsContainer = document.getElementById("cartItemsContainer");

  const renderAbleHtml = cart_items
    .map((item_id, idx) => {
      const item = drinks_items.find((i) => i.id === item_id);
      return generateCardItem(item, idx + 1);
    })
    .join("");

  cartItemsContainer.innerHTML = renderAbleHtml;

  function generateCardItem(item, sr) {
    const { name, imageUrl } = item;
    return ` <tr>
                  <td>${sr}</td>
                  <td>
                    <img src="${imageUrl}" class="img-fluid cart-item-img"  alt="Thumb" />
                  </td>
                  <td>${name}</td>
                </tr>`;
  }
}

function start() {
  renderDrinksItems();
  renderCartItems();
  detailsHandler();
  addToCartHandler();
  searchHandler();
}

fetchDrinksItem().then(() => {
  start();
});
