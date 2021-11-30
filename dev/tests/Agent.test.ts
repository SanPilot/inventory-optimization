//<reference types="@types/jest"/>
import { SearchAgent } from "../src/ai";
import { Inventory, Assignment, Product, Order, Customer } from "../src/model";
import fc from "fast-check";

describe("search agent", () => {
  const agent = new SearchAgent();
  test("can assign products to customers", () => {
    expect(agent.assign([], new Inventory()))
      .toEqual(new Assignment());
  });
  test("never assigns customers products they are allergic to", () => {
    fc.assert(fc.property(arbitraryProblem(4), ([orders, inventory]) => {
      const assignment = agent.assign(orders, inventory);
      expect(
        orders.every(([customer]) => !customer.isAllergicToAny(assignment.productsGivenTo(customer)))
      )
    }))
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
    fc.tuple(fc.array(arbitraryOrder(products, maxOrderSize)), arbitraryInventory(products)));
}

function arbitraryProducts(): fc.Arbitrary<Product[]> {
  return fc.set(
    fc.tuple(fc.string(), fc.integer({ min: 0 }))
      .map(([name, cost]) => new Product(name, cost))
  );
}

function arbitraryInventory(products: Product[]): fc.Arbitrary<Inventory> {
  return fc.array(
    fc.nat(), { minLength: products.length, maxLength: products.length }
  ).map(qs => {
    return new Inventory(
      products.map((product, index) => [product, qs[index]])
    );
  });
}

function arbitraryOrder(products: Product[], maxOrderSize: number): fc.Arbitrary<Order> {
  return fc.tuple(arbitraryCustomer(products), fc.nat({ max: maxOrderSize }));
}

function arbitraryCustomer(products: Product[]): fc.Arbitrary<Customer> {
  return fc.tuple(arbitraryPreferences(products), arbitraryAllergies(products), fc.string())
    .map(([prefs, allergies, name]) => new Customer(prefs, new Set(allergies), name));
}

function arbitraryPreferences(products: Product[]): fc.Arbitrary<Map<Product, number>> {
  return fc.array(fc.float(), { minLength: products.length, maxLength: products.length }).map(prefs => new Map(prefs.map((val, index) => [products[index], val])));
}

function arbitraryAllergies(products: Product[]): fc.Arbitrary<Product[]> {
  return fc.shuffledSubarray(products);
}
