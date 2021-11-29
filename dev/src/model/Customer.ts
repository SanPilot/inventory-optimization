/**
 * Represents a customer with a list of preferences.
 */

import { Product } from './Product';

export class Customer {

    private _preferences: Map<Product, number>;
    private allergies: Set<Product>;

    constructor() {
        this._preferences = new Map<Product, number>();
        this.allergies = new Set<Product>();
    }
}