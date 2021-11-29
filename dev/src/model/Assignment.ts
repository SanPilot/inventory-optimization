/**
 * A map of customers to products.
 * Can be evaluated for the score of the assignment.
 */

import { Product } from './Product';
import { Customer } from './Customer';

export class Assignment {
  private _assignment: Map<Customer, Product[]>;

  constructor() {
    this._assignment = new Map<Customer, Product[]>();
  }

  productsOf(customer: Customer) {
    return this._assignment.get(customer) ?? [];
  }

  addProduct(customer: Customer, product: Product) {
    const products = this.productsOf(customer);
    this._assignment.set(customer, [...products, product]);
    return this;
  }

}
