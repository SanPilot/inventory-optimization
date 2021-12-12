//<reference types="@types/jest"/>
import { describe, test, expect } from "@jest/globals";
import { List, Set, Map } from "immutable";
import { SearchAgent } from "../src/ai";
import { Inventory, Assignment, Product, Order, Customer } from "../src/model";
import { stringify } from "csv";
import fc from "fast-check";
import { RandomAssignmentAgent } from "../src/ai/RandomAssignmentAgent";
import fs from "fs";
import { arbitraryProblem } from "../src/generator";
import { defaultFeatureVectors } from "../src/ai/features";

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
    fc.assert(fc.property(arbitraryProblem(4), ([orders, inventory]) => {
      const start = new Date().getTime();
      const assignment = agent.assign(List(orders), inventory);
      const duration = new Date().getTime() - start;
      document.write([inventory.products().size, orders.length, duration]);
    }), { numRuns: 10 });
    document.end();
  });
});

describe("compare agents", () => {
  test("random doesn't perform better (in evaluation) than graph search", () => {
    fc.assert(fc.property(arbitraryProblem(4), ([orders, inventory]) => {
      const randomAssignment = new RandomAssignmentAgent().assign(List(orders), inventory);
      const optimalAssignment = new SearchAgent().assign(List(orders), inventory, defaultFeatureVectors);
      console.log('random:', randomAssignment.toResult().assignment.toString());
      console.log('optimal:', optimalAssignment.toResult().assignment.toString());
      const optimalEvaluation = optimalAssignment.evaluate(defaultFeatureVectors);
      const randomEvaluation = randomAssignment.evaluate(defaultFeatureVectors);
      try {
        expect(optimalAssignment)
          .toBeGreaterThanOrEqual(randomEvaluation)
      }
      catch  {
        expect(optimalEvaluation).toBeCloseTo(randomEvaluation, 10);
      }
    }), { seed: 1078364960, path: "2:2:1:1:3:3:4:5:5:4:5:4:5:4:6:4:8:9:8:10:8:8:10:8:8:8:9:8:9:8:10:0:1:1:1:2:1:1:1:1:1:1:2:4:1:2:3:3:1:2:2:2:2:2:2:2:2:1:1:1:1:1:1:1", endOnFailure: true });
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
        orders.every(({ customer }) => !customer.isAllergicToAny(assignment.toResult().assignment.productsGivenTo(customer)))
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
