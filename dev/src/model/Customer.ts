/**
 * Represents a customer with a list of preferences.
 */

import { Product } from './Product';

export class Customer {

    private _preferences: Map<Product, number>;
    private allergies: Set<Product>;

    constructor(preferences: Map<Product, number>, allergies: Set<Product>) {
        this._preferences = preferences;
        this.allergies = allergies;
    }

    isAllergicToAny(products: Product[]) {
        return products.some(product => this.allergies.has(product));
    }
}
