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

    isAllergicTo(product: Product): boolean {
        return this.allergies.has(product);
    }

    isAllergicToAny(products: Product[]): boolean {
        return products.some(product => this.isAllergicTo(product));
    }
}
