import {describe, test, expect} from "@jest/globals";
import {State} from "../src/ai";
import {Assignment, customerA, customerB, Inventory, inventory, Order, orders, productA} from "../src/model";
import {Set, Map, List} from "immutable";

describe("successor states", () => {
  test("exhaustively generate successor states", () => {
    const state = new State({
      assignment: new Assignment(),
      originalOrders: orders,
      orders,
      inventory
    });
    const successors = state.getSuccessors();
    const assignA = new State({
      assignment: new Assignment({
        products: Map([
          [customerA, Set([productA])]
        ])
      }),
      originalOrders: orders,
      orders: List([
        new Order({customer: customerA, size: 1}),
        new Order({customer: customerB, size: 2})
      ]),
      inventory: new Inventory({
        quantities: Map([
          [productA, 0]
        ])
      })
    });
    const assignB = new State({
      assignment: new Assignment({
        products: Map([
          [customerA, Set([productA])]
        ])
      }),
      originalOrders: orders,
      orders: List([
        new Order({customer: customerA, size: 2}),
        new Order({customer: customerB, size: 1})
      ]),
      inventory: new Inventory({
        quantities: Map([
          [productA, 0]
        ])
      })
    });
    expect(successors.equals(Set([assignA, assignB])));
  });
});
