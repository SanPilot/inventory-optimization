/**
 * Represents a customer with a list of preferences.
 */

import { Product } from './Product';

export class Customer {

    private _preferences: Map<Product, number>;
    private _allergies: Set<Product>;
    private _name: string;

    constructor(preferences: Map<Product, number>, allergies: Set<Product>, name: string) {
        this._preferences = preferences;
        this._allergies = allergies;
        this._name = name;
    }

    isAllergicToAny(products: Product[]) {
        return products.some(product => this._allergies.has(product));
    }

    preferenceFor(product: Product): number {
        return this._preferences.get(product) ?? 0;
    }

    get name(): string {
        return this._name;
    }
}
