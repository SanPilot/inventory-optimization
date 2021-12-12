import {Product, Inventory, Customer, Order} from ".";
import {List, Map, Set} from "immutable";

export const productA = new Product({name: "product A", cost: 1});

export const inventory = new Inventory({
  quantities: Map([
    [productA, 1]
  ])
});

export const customerA = new Customer({
  preferences: Map([
    [productA, 1]
  ]),
  allergies: Set(),
  name: "customer A"
});

export const customerB = new Customer({
  preferences: Map([
    [productA, 0]
  ]),
  allergies: Set(),
  name: "customer B"
})

export const orders = List([
  new Order({customer: customerA, size: 2}),
  new Order({customer: customerB, size: 2})
]);