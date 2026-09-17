const ORDER_SUBMISSION_URL = "http://127.0.0.1:5000/api/orders/push";

const products = [
	{
		id: "100321",
		title: "Everyday Canvas Tote",
		price: "$18.00",
		description: "A sturdy reusable tote for groceries, books, and daily essentials."
	},
	{
		id: "204587",
		title: "Insulated Travel Mug",
		price: "$24.00",
		description: "A practical insulated mug keeping your favorite drinks warm longer."
	},
	{
		id: "318904",
		title: "Compact Desk Lamp",
		price: "$32.00",
		description: "A compact adjustable lamp bringing focused light to your workspace."
	},
	{
		id: "427116",
		title: "Soft Cotton Throw",
		price: "$29.00",
		description: "A cotton throw adding comfort to your sofa or chair."
	},
	{
		id: "563782",
		title: "Minimal Ceramic Planter",
		price: "$16.00",
		description: "A simple ceramic planter for small plants and bright windowsills."
	},
	{
		id: "691245",
		title: "Daily Notes Notebook",
		price: "$12.00",
		description: "A lined notebook for plans, ideas, lists, and everyday notes."
	}
];

function createProductCard(product) {
	const card = document.createElement("article");
	card.className = "product-card";
	card.dataset.productId = product.id;
	card.tabIndex = 0;
	card.setAttribute("role", "button");
	card.setAttribute("aria-label", `Order ${product.title}`);
	card.innerHTML = `
    <div class="product-image" aria-hidden="true">${product.title.charAt(0)}</div>
    <div class="product_card">
      <p class="product_id">ID: ${product.id}</p>
      <h3 class="product_title">${product.title}</h3>
      <p class="product_description">${product.description}</p>
      <div class="product-footer">
        <strong class="product_price">${product.price}</strong>
        <span class="order-link">Order now</span>
      </div>
    </div>
  `;
	card.addEventListener("click", () => openOrderForm(product));
	card.addEventListener("keydown", (event) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			openOrderForm(product);
		}
	});
	return card;
}

function renderProducts() {
	document.querySelectorAll("[data-product-list]").forEach((list) => {
		const items = list.dataset.productList === "featured" ? products.slice(0, 3) : products;
		items.forEach((product) => list.appendChild(createProductCard(product)));
	});
}

function openOrderForm(product) {
	const section = document.querySelector("#order-form-section");
	if (!section) {
		window.location.href = `products.html?product=${encodeURIComponent(product.id)}`;
		return;
	}

	document.querySelector("#product-id").value = product.id;
	document.querySelector("#product-title").value = product.title;
	section.hidden = false;
	section.scrollIntoView({ behavior: "smooth", block: "start" });
	document.querySelector("#order-form [name='address']").focus();
}

function closeOrderForm() {
	const section = document.querySelector("#order-form-section");
	if (section) section.hidden = true;
}

function setupOrderForm() {
	const form = document.querySelector("#order-form");
	if (!form) return;

	document.querySelector("[data-close-form]").addEventListener("click", closeOrderForm);
	const requestedProduct = new URLSearchParams(window.location.search).get("product");
	const product = products.find((item) => item.id === requestedProduct);
	if (product) openOrderForm(product);

	form.addEventListener("submit", async (event) => {
		event.preventDefault();
		const status = form.querySelector(".form-status");
		const submitButton = form.querySelector("button[type='submit']");
		status.textContent = "Sending...";
		status.className = "form-status";
		submitButton.disabled = true;

		try {
			const response = await fetch(ORDER_SUBMISSION_URL, {
				method: "POST",
				body: new FormData(form)
			});
			if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
			status.textContent = "Order request sent successfully.";
			status.classList.add("success");
			form.reset();
		} catch (error) {
			console.error("Order submission failed:", error);
			status.textContent = "Could not send your order. Please try again.";
			status.classList.add("error");
		} finally {
			submitButton.disabled = false;
		}
	});
}

renderProducts();
setupOrderForm();
