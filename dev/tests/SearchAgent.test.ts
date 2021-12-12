import {describe, test, expect} from "@jest/globals";
import {SearchAgent} from "../src/ai";
import {
  productA,
  customerA,
  customerB,
  inventory,
  orders
} from "../src/model/examples";
import {Set} from "immutable";
import {satisfactionOnly} from "../src/ai/features";

describe("search agent simple examples", () => {
  test("prioritizes customer that prefers product", () => {
    const assignment = new SearchAgent()
      .assign(orders, inventory, satisfactionOnly)
      .toResult().assignment;
    expect(assignment.productsGivenTo(customerB)).toEqual(Set([productA]));
    expect(assignment.productsGivenTo(customerA)).toEqual(Set());
  });
});