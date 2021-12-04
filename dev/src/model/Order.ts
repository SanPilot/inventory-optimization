import {Record} from "immutable";
import {Customer} from "./Customer";


/**
 * Represents a customer and the number of products in their order.
 */
export class Order extends Record({customer: new Customer(), size: 1}) {

}
