/**
 * A map of customers to products.
 * Can be evaluated for the score of the assignment.
 */

import { Product } from './Product';
import { Customer } from './Customer';
import _ from "lodash";

export class Assignment {
  private _assignment: Map<Customer, Product[]>;

  constructor() {
    this._assignment = new Map<Customer, Product[]>();
  }

  productsGivenTo(customer: Customer): Product[] {
    return this._assignment.get(customer) ?? [];
  }

  addProduct(customer: Customer, product: Product) {
    const products = this.productsGivenTo(customer);
    this._assignment.set(customer, [...products, product]);
    return this;
  }

  cost(): number {
    return _.sum(
      Array.from(this._assignment.keys())
        .map(customer => this.costOfCustomer(customer))
    )
  }

  costOfCustomer(customer: Customer) {
    return _.sum(
      this.productsGivenTo(customer).map(product => product.cost)
    );
  }

}
