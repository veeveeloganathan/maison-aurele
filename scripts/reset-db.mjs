// Restores product stock from the seed file and clears all orders.
import { copyFileSync, writeFileSync } from "fs";
copyFileSync("data/products.seed.json", "data/products.json");
writeFileSync("data/orders.json", "[]\n");
console.log("Demo data reset.");
