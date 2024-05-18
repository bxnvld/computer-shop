const getCheckoutSessionUrl = async (productId) => {
  let api = new Frisbee({
    baseURI: "http://127.0.0.1:8000", // optional
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, PUT, PATCH, POST, DELETE",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });

  try {
    const res = await api.post(
      `/api/v1/bookings/checkout-session/${productId}`
    );

    if (res.ok) {
      const url = res.body.session.url;
      location.assign(url);
    }
  } catch (err) {
    console.log("Error occured during creation of stripe session!");
  }
};

const button = document.getElementById("book-product");

button.addEventListener("click", async () => {
  const productId = button.getAttribute("data-product-id");
  await getCheckoutSessionUrl(productId);
});
