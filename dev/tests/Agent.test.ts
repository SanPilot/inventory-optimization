//<reference types="@types/jest"/>
import {List, Set, Map} from "immutable";
import { SearchAgent } from "../src/ai";
import { Inventory, Assignment, Product, Order, Customer } from "../src/model";
import { stringify } from "csv";
import fc from "fast-check";
import fs from "fs";

describe("search agent", () => {
  const agent = new SearchAgent();
  test("can assign products to customers", () => {
    expect(agent.assign(List(), new Inventory()))
      .toEqual(new Assignment());
  });
  test("run samples to produce csv file", () => {
    const document = stringify({columns: ["Products", "Orders", "Runtime (ms)"], header: true});
    const file = fs.createWriteStream("tests.csv");
    document.pipe(file);
    fc.assert(fc.property(arbitraryProblem(4), ([orders, inventory]) => {
      const start = new Date().getTime();
      const assignment = agent.assign(List(orders), inventory);
      const duration = new Date().getTime() - start;
      document.write([inventory.products().size, orders.length, duration]);
    }), {numRuns: 10});
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

function arbitraryProblem(maxOrderSize: number): fc.Arbitrary<[Order[], Inventory]> {
  return arbitraryProducts().chain(products =>
    fc.tuple(fc.array(arbitraryOrder(products, maxOrderSize), {minLength: 1, maxLength: 10}), arbitraryInventory(products)));
}

function arbitraryProducts(): fc.Arbitrary<Product[]> {
  return fc.set(
    fc.tuple(fc.string(), fc.integer({min: 0, max: 100*20}))
      .map(([name, cost]) => new Product({name, cost})),
    {minLength: 1, maxLength: 10}
  );
}

function arbitraryInventory(products: Product[]): fc.Arbitrary<Inventory> {
  return fc.array(
    fc.nat({max: 10}), {minLength: products.length, maxLength: products.length}
    ).map(qs => {
      return new Inventory({
        quantities: Map(List(products).map((product, index) => [product, qs[index]]))
      });
  });
}

function arbitraryOrder(products: Product[], maxOrderSize: number): fc.Arbitrary<Order> {
  return fc.tuple(arbitraryCustomer(products), fc.integer({ min: 1, max: maxOrderSize }))
    .map(([customer, size]) => new Order({customer, size}))
}

function arbitraryCustomer(products: Product[]): fc.Arbitrary<Customer> {
  return fc.tuple(arbitraryPreferences(products), arbitraryAllergies(products), fc.string())
    .map(([preferences, allergies, name]) => new Customer({
      preferences,
      allergies: Set(allergies),
      name
    }));
}

function arbitraryPreferences(products: Product[]): fc.Arbitrary<Map<Product, number>> {
  return fc.array(fc.float(), { minLength: products.length, maxLength: products.length })
           .map(prefs => Map(prefs.map((val, index) => [products[index], val])));
}

function arbitraryAllergies(products: Product[]): fc.Arbitrary<Product[]> {
  return fc.shuffledSubarray(products);
}
