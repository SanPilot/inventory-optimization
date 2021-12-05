//<reference types="@types/jest"/>
import {describe, test, expect} from "@jest/globals";
import { List, Set, Map } from "immutable";
import { SearchAgent } from "../src/ai";
import { Inventory, Assignment, Product, Order, Customer } from "../src/model";
import { stringify } from "csv";
import fc from "fast-check";
import { RandomAssignmentAgent } from "../src/ai/RandomAssignmentAgent";
import fs from "fs";
import {arbitraryProblem} from "../src/generator";

describe("search agent", () => {
  const agent = new SearchAgent();
  test("can assign products to customers", () => {
    expect(agent.assign(List(), new Inventory()))
      .toEqual(new Assignment());
  });
  test("run samples to produce csv file", () => {
    const document = stringify({ columns: ["Products", "Orders", "Runtime (ms)"], header: true });
    const file = fs.createWriteStream("search_" + new Date().toISOString() + ".csv");
    document.pipe(file);
    document.pipe(process.stdout);
    fc.assert(fc.property(arbitraryProblem(4), ([orders, inventory]) => {
      const start = new Date().getTime();
      const assignment = agent.assign(List(orders), inventory);
      const duration = new Date().getTime() - start;
      document.write([inventory.products().size, orders.length, duration]);
    }), { numRuns: 10 });
    document.end();
  })
});

describe("random agent", () => {
  const agent = new RandomAssignmentAgent();
  test("can assign products to customers", () => {
    expect(agent.assign(List(), new Inventory()))
      .toEqual(new Assignment());
  });
  test("never assigns customers products they are allergic to", () => {
    fc.assert(fc.property(arbitraryProblem(4), ([orders, inventory]) => {
      const assignment = agent.assign(List(orders), inventory);
      expect(
        orders.every(({ customer }) => !customer.isAllergicToAny(assignment.productsGivenTo(customer)))
      )
    }), { numRuns: 1000 });
  });
  test("run samples to produce csv file", () => {
    const document = stringify({ columns: ["Products", "Orders", "Runtime (ms)"], header: true });
    const file = fs.createWriteStream("random_" + new Date().getTime() + ".csv");
    document.pipe(file);
    fc.assert(fc.property(arbitraryProblem(4), ([orders, inventory]) => {
      const start = new Date().getTime();
      const assignment = agent.assign(List(orders), inventory);
      const duration = new Date().getTime() - start;
      document.write([inventory.products().size, orders.length, duration]);
    }), { numRuns: 10000 });
    document.end();
  })
});

describe("problem generator", () => {
  test("can produce samples", () => {
    const samples = fc.sample(arbitraryProblem(4), 10);
    console.dir(samples);
    expect(samples).toBeDefined();
  })
});
