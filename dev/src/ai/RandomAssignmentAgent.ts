import { List } from "immutable";
import { Agent } from "./Agent";
import { Order, Inventory, Assignment, Customer } from "../model";
import { ProblemState } from "./State";
import { StateNode } from "./Graph";
import { State } from "./State";

/**
 * A search agent that randomly assigns products to customers, satisfying hard constraints and quantities.
 */
export class RandomAssignmentAgent implements Agent {

  name: string = "Random Assignment Agent";

  assign(orders: List<Order>, inventory: Inventory): StateNode<ProblemState> {
    let assignment = new Assignment();

    // for each product in the inventory
    for (const product of inventory.products()) {

      // repeat for the quantity of the product
      let remainingQuantity: number = inventory.quantityOf(product);
      while (remainingQuantity > 0) {

        // filter customers that are not allergic to the product and do not have the product already
        const compatibleCustomers = orders.filter(order =>
          !order.customer.isAllergicTo(product) &&
          !assignment.hasProductAssignedToCustomer(order.customer, product) &&
          assignment.productsGivenTo(order.customer).size < order.size);

        // if there are no customers that are not allergic to the product, skip this product
        if (compatibleCustomers.size === 0) {
          break;
        }

        // pick a random customer
        const customer: Customer = compatibleCustomers.get(Math.floor(Math.random() * compatibleCustomers.size))!.customer;

        // try assigning that product to the customer
        try {
          assignment = assignment.assignProductToCustomer(customer, product);
          remainingQuantity--;
        } catch (e) {
          console.error(e);
        }
      }
    }
    return new State({ assignment, orders, originalOrders: orders, inventory });
  }
}
