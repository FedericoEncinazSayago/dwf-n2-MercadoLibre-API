// Realiza una búsqueda en la API de Mercado Libre y devuelve la respuesta en formato JSON
async function searchMercadoLibre(product) {
  try {
    const url = "https://api.mercadolibre.com/sites/MLA/search?q=";
    const response = await fetch(url + product);

    if (!response.ok) throw new Error(`Error de red: ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error("Error durante la solicitud:", error.message);
  }
}

// Itera sobre los productos y agrega cada uno al DOM
function addProductsInDOM(products) {
  clearPreviousSearches();

  const template = document.getElementById("result-template");
  const results = document.querySelector(".results-section .results");
  const spanResult = document.querySelector(".result-counts");
  spanResult.textContent = products.length;

  for (const product of products) {
    const clone = document.importNode(template.content, true);
    addImage(clone, product);
    addInformationProduct(clone, product);
    results.appendChild(clone);
  }
}

// Limpia los resultados de búsquedas anteriores del DOM
function clearPreviousSearches() {
  const productsSection = document.querySelector(".results-section .results");

  while (productsSection.firstChild) {
    productsSection.removeChild(productsSection.firstChild);
  }
}

// Agrega el enlace permanente e imagen del producto al clon de la plantilla
function addImage(clone, product) {
  const imageEl = clone.querySelector(".result-item__img");
  imageEl.src = product.thumbnail;
}

// Agrega la información del producto al clon de la plantilla
function addInformationProduct(clone, product) {
  const resultItemContentEl = clone.querySelector(".result-item-content");
  const spanPriceEl = clone.querySelector(".quantity__price");
  const spanStockEl = clone.querySelector(".quantity__stock");

  for (const child of resultItemContentEl.children) {
    const key = parsearClass(child.className);

    if (key === "stock") {
      spanStockEl.textContent = product["order_backend"];
    } else {
      child.textContent = product[key];
    }
  }

  spanPriceEl.textContent = "$" + product[parsearClass(spanPriceEl.className)];
}

// Convierte el nombre de clase en una clave para acceder a las propiedades del producto
function parsearClass(className) {
  const parts = className.split("__");
  return parts[1];
}

function main() {
  const formEl = document.querySelector(".search-form");

  formEl.addEventListener("submit", async (event) => {
    event.preventDefault();

    const JSONResponse = await searchMercadoLibre(
      event.target.productSearch.value
    );
    const products = JSONResponse.results;

    addProductsInDOM(products);
  });
}

main();
