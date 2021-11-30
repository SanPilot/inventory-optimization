/**
 * Stores the available products, and the quantity of each product.
 */

import { Product } from "./Product";

export class Inventory {
  
  private _inventory: Map<Product, number>;

  constructor(quantities: [Product, number][] = []) {
    this._inventory = new Map(quantities);
  }

  addProduct(product: Product, quantity: number): this {
    const existing = this.quantityOf(product);
    this._inventory.set(product, existing + quantity);
    return this;
  }

  quantityOf(product: Product): number {
    return this._inventory.get(product) ?? 0;
  }

}
