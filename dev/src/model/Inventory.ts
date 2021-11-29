/**
 * Stores the available products, and the quantity of each product.
 */

import { Product } from "./Product";

export class Inventory {
  private _inventory: Map<Product, number>;

  constructor() {
    this._inventory = new Map();
  }
}
