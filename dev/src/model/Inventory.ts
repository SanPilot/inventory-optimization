/**
 * Stores the available products, and the quantity of each product.
 */

import { Product } from "./Product";

export class Inventory {
  
  private _inventory: Map<Product, number>;

  constructor(quantities: [Product, number][] = []) {
    this._inventory = new Map(quantities);
  }

  copy() {
    return new Inventory(Array.from(this._inventory.entries()));
  }

  addProduct(product: Product, quantity: number): this {
    const existing = this.quantityOf(product);
    this._inventory.set(product, existing + quantity);
    return this;
  }

  removeProduct(product: Product, quantity: number): this {
    const existing = this.quantityOf(product);
    if (quantity > existing) {
      throw new Error("Cannot remove more product than remains in inventory");
    }
    this._inventory.set(product, existing - quantity);
    return this;
  }

  quantityOf(product: Product): number {
    return this._inventory.get(product) ?? 0;
  }

  products(): Product[] {
    return Array.from(this._inventory.keys()).filter(product => this.quantityOf(product) > 0);
  }

}
