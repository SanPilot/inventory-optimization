import {describe, test, expect} from "@jest/globals";
import {SearchAgent} from "../src/ai";
import {Assignment, Customer, Inventory, Order, Product} from "../src/model";
import {List, Map, Set} from "immutable";
import { satisfactionOnly } from "../src/ai/features";

describe("search agent simple examples", () => {
  test("prioritizes customer that prefers product", () => {
    const productA = new Product({name: "product A", cost: 1});
    const inventory = new Inventory({
      quantities: Map([
        [productA, 1]
      ])
    });
    const customerA = new Customer({
      preferences: Map([
        [productA, 1]
      ]),
      allergies: Set(),
      name: "customer A"
    });
    const customerB = new Customer({
      preferences: Map([
        [productA, 0]
      ]),
      allergies: Set(),
      name: "customer B"
    })
    const orders = List([
      new Order({customer: customerA, size: 2}),
      new Order({customer: customerB, size: 2})
    ]);
    const assignment = new SearchAgent()
      .assign(orders, inventory, satisfactionOnly)
      .toResult().assignment;
    expect(assignment.productsGivenTo(customerA)).toEqual(Set([productA]));
    expect(assignment.productsGivenTo(customerB)).toEqual(Set());
  });
});