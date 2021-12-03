import {Record} from "immutable";

/**
 * Encodes the information associated with a product. This includes the name, cost.
 */
export class Product extends Record({name: "", cost: 0}) {

}