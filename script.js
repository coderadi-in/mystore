/* ---------------------------------------------------------
   store.js — only job: open order modal and submit the form
   --------------------------------------------------------- */

// Change this to your actual endpoint that receives orders.
const submissionURL = 'http://127.0.0.1:5000/api/orders/push';

// DOM refs
const modal = document.getElementById('orderModal');
const form = document.getElementById('orderForm');
const idInput = document.getElementById('productId');
const titleInput = document.getElementById('productTitle');
const cancelBtn = document.getElementById('cancelBtn');
const grid = document.getElementById('productGrid');

/* ---------- Open modal when a product card is clicked ---------- */
grid.addEventListener('click', (event) => {
	const card = event.target.closest('.product-card');
	if (!card) return;

	idInput.value = card.dataset.id;
	titleInput.value = card.dataset.title;

	modal.classList.add('active');
});

/* ---------- Close modal on cancel ---------- */
cancelBtn.addEventListener('click', () => {
	modal.classList.remove('active');
	form.reset();
});

/* Also close when clicking the dark overlay (outside the modal box) */
modal.addEventListener('click', (event) => {
	if (event.target === modal) {
		modal.classList.remove('active');
		form.reset();
	}
});

/* ---------- Submit the order ---------- */
form.addEventListener('submit', async (event) => {
	event.preventDefault();

	const formData = new FormData(form);

	try {
		await fetch(submissionURL, {
			method: 'POST',
			mode: 'no-cors',      // required per spec
			body: formData
		});

		// With no-cors the response is opaque, so we can't read status.
		// We assume success and just give feedback.
		alert('Order placed! Thank you.');
		modal.classList.remove('active');
		form.reset();
	} catch (error) {
		console.error('Order submission failed:', error);
		alert('Something went wrong. Please try again.');
	}
});