
import {Record, Map, List} from "immutable";
import {Product} from "./Product";

/**
 * Stores the available products, and the quantity of each product.
 */
export class Inventory extends Record({quantities: Map<Product,number>()}) {

  addProduct(product: Product, quantity: number): Inventory {
    const existing = this.quantityOf(product);
    return new Inventory({quantities: this.quantities.set(product, existing + quantity)})
  }

  removeProduct(product: Product, quantity: number): Inventory {
    const existing = this.quantityOf(product);
    if (quantity > existing) {
      throw new Error("Cannot remove more product than remains in inventory");
    }
    return new Inventory({quantities: this.quantities.set(product, existing - quantity)});
  }

  quantityOf(product: Product): number {
    return this.quantities.get(product) ?? 0;
  }

  products(): List<Product> {
    return this.quantities.keySeq().filter(product => this.quantityOf(product) > 0).toList();
  }

}
