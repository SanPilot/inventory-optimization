
import {Record, Map, Set} from "immutable";
import {Product} from './Product';

/**
 * Represents a customer with a list of preferences.
 */
export class Customer extends Record({
    preferences: Map<Product, number>(),
    allergies: Set<Product>(),
    name: ""
}) {

    isAllergicTo(product: Product): boolean {
        return this.allergies.has(product);
    }

    isAllergicToAny(products: Set<Product>): boolean {
        return Array.from(products).some(product => this.isAllergicTo(product));
    }

    preferenceFor(product: Product): number {
        return this.preferences.get(product) ?? 0;
    }

}