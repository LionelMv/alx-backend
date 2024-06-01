import express from "express";
import { promisify } from "util";
import { createClient } from "redis";

const listProducts = [
  {
    itemId: 1,
    itemName: "Suitcase 250",
    price: 50,
    initialAvailableQuantity: 4,
  },
  {
    itemId: 2,
    itemName: "Suitcase 450",
    price: 100,
    initialAvailableQuantity: 10,
  },
  {
    itemId: 3,
    itemName: "Suitcase 650",
    price: 350,
    initialAvailableQuantity: 2,
  },
  {
    itemId: 4,
    itemName: "Suitcase 1050",
    price: 550,
    initialAvailableQuantity: 5,
  },
];

const getItemById = (id) => {
  return listProducts.find((obj) => obj.itemId === id);
};

const app = express();
const client = createClient();
const PORT = 1245;

const reserveStockById = async (itemId, stock) => {
  return promisify(client.SET).bind(client)(`item.${itemId}`, stock);
};

const getCurrentReservedStockById = async (itemId) => {
  return promisify(client.GET).bind(client)(`item.${itemId}`);
};

app.get("/list_products", (_, res) => {
  res.json(listProducts);
});

app.get("/list_products/:itemId(\\d+)", async (req, res) => {
  const itemId = Number.parseInt(req.params.itemId);
  const productItem = getItemById(itemId);

  if (!productItem) {
    res.status(404).json({ status: "Product not found" });
    return;
  }

  const reservedStock = await getCurrentReservedStockById(itemId);
  const currentQuantity =
    productItem.initialAvailableQuantity -
    (reservedStock ? Number.parseInt(reservedStock) : 0);

  res.json({ ...productItem, currentQuantity });
});

app.get("/reserve_product/:itemId", async (req, res) => {
  const itemId = Number.parseInt(req.params.itemId);
  const productItem = getItemById(itemId);

  if (!productItem) {
    res.status(404).json({ status: "Product not found" });
    return;
  }

  const reservedStock = await getCurrentReservedStockById(itemId);
  const currentQuantity =
    productItem.initialAvailableQuantity -
    (reservedStock ? Number.parseInt(reservedStock) : 0);

  if (currentQuantity <= 0) {
    res.status(404).json({ status: "Not enough stock available", itemId });
    return;
  }

  await reserveStockById(
    itemId,
    (reservedStock ? Number.parseInt(reservedStock) : 0) + 1
  );
  res.json({ status: "Reservation confirmed", itemId });
});

const resetProductsStock = () => {
  return Promise.all(
    listProducts.map((item) =>
      promisify(client.SET).bind(client)(`item.${item.itemId}`, 0)
    )
  );
};

app.listen(PORT, () => {
  resetProductsStock().then(() => {
    console.log(`API available on localhost port ${PORT}`);
  });
});

export default app;
