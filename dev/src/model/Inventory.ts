
import {Record, Map, Set} from "immutable";
import {Product} from "./Product";
import _ from "lodash";

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

  products(): Set<Product> {
    return Set(this.quantities.keys()).filter(product => this.quantityOf(product) > 0);
  }

  value(): number {
    return _.sum(Array.from(this.quantities.values()));
  }

}
