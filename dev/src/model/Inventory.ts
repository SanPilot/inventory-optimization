/**
 * Stores the available products, and the quantity of each product.
 */

import { Product } from "./Product";

class Inventory {
  private _inventory: Map<Product, number>;

  constructor() {
    this._inventory = new Map();
  }
}