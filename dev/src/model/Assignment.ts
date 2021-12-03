/**
 * A map of customers to products.
 * Can be evaluated for the score of the assignment.
 */

import { Record, Map, Set, List } from "immutable";
import { Product } from './Product';
import { Customer } from './Customer';
import _ from "lodash";
import { Order } from './Order';

export class Assignment extends Record({products: Map<Customer, Set<Product>>()}) {

  productsGivenTo(customer: Customer): Set<Product> {
    return this.products.get(customer) ?? Set();
  }

  assignProductToCustomer(customer: Customer, product: Product) {
    // throw error if customer is allergic to product
    if (customer.isAllergicTo(product)) {
      throw new Error(`Customer ${customer.name} is allergic to ${product.name}`);
    }
    // throw error if customer already has product
    if (this.hasProductAssignedToCustomer(customer, product)) {
      throw new Error(`Customer ${customer.name} already has ${product.name}`);
    }
    return new Assignment({products: this.products.set(
      customer,
      this.productsGivenTo(customer).add(product)
    )});
  }

  hasProductAssignedToCustomer(customer: Customer, product: Product) {
    return this.productsGivenTo(customer).has(product);
  }

  fulfillsOrders(orders: List<Order>): boolean {
    return orders.every(order => this.productsGivenTo(order.customer).size === order.size);
  }

  cost(): number {
    return _.sum(
      this.products.keySeq().map(customer => this.costOfCustomer(customer)).toJS()
    )
  }

  costOfCustomer(customer: Customer): number {
    return _.sum(
      this.productsGivenTo(customer).map(product => product.cost).toJS()
    );
  }

}
