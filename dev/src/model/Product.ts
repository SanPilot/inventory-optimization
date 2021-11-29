/**
 * Encodes the information associated with a product. This includes the name, cost.
 */

export class Product {
    private _name: string;
    private _cost: number;

    constructor(name: string, cost: number) {
        this._name = name;
        this._cost = cost;
    }

    get name(): string {
        return this._name;
    }

    get cost(): number {
        return this._cost;
    }
}