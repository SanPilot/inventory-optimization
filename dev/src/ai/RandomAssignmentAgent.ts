import { Agent } from "./Agent";
import { Order, Inventory, Assignment, Customer } from "../model";

/**
 * A search agent that randomly assigns products to customers, satisfying hard constraints and quantities.
 */
export class RandomAssignmentAgent implements Agent {

  assign(orders: Order[], inventory: Inventory): Assignment {
    const assignment = new Assignment();

    // for each product in the inventory
    for (const product of inventory.products()) {

      // repeat for the quantity of the product
      let remainingQuantity: number = inventory.quantityOf(product);
      while (remainingQuantity > 0) {

        // filter customers that are not allergic to the product and do not have the product already
        const compatibleCustomers = orders.filter(([customer]) =>
          !customer.isAllergicTo(product) &&
          !assignment.hasProductAssignedToCustomer(customer, product));

        // if there are no customers that are not allergic to the product, skip this product
        if (compatibleCustomers.length === 0) {
          break;
        }

        // pick a random customer
        const customer: Customer = compatibleCustomers[Math.floor(Math.random() * compatibleCustomers.length)][0];

        // try assigning that product to the customer
        try {
          assignment.assignProductToCustomer(customer, product);
          remainingQuantity--;
        } catch (e) {
          console.error(e);
        }
      }
    }
    return assignment;
  }
}
