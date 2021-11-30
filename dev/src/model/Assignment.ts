/**
 * A map of customers to products.
 * Can be evaluated for the score of the assignment.
 */

import { Product } from './Product';
import { Customer } from './Customer';
import _ from "lodash";

export class Assignment {
  private _assignment: Map<Customer, Set<Product>>;

  constructor() {
    this._assignment = new Map<Customer, Set<Product>>();
  }

  productsGivenTo(customer: Customer): Product[] {
    // convert set to array

    return Array.from(this._assignment.get(customer) ?? []);
  }

  addProduct(customer: Customer, product: Product) {
    // throw error if customer is allergic to product
    if (customer.isAllergicToAny([product])) {
      throw new Error(`Customer ${customer.name} is allergic to ${product.name}`);
    }

    // throw error if customer already has product
    if (this.productsGivenTo(customer).includes(product)) {
      throw new Error(`Customer ${customer.name} already has ${product.name}`);
    }

    const products: Product[] = this.productsGivenTo(customer);
    this._assignment.set(customer, new Set(products.concat(product)));
    return this;
  }

  cost(): number {
    return _.sum(
      Array.from(this._assignment.keys())
        .map(customer => this.costOfCustomer(customer))
    )
  }

  costOfCustomer(customer: Customer): number {
    return _.sum(
      this.productsGivenTo(customer).map(product => product.cost)
    );
  }

}
