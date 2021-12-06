import fc from "fast-check";
import { SearchAgent } from "./ai";
import { List } from "immutable";
import { stringify } from "csv";
import { arbitraryProblem } from "./generator";
import fs from "fs";
import { defaultFeatureVectors } from "./ai/features";
import { Agent } from "./ai/Agent";
import { RandomAssignmentAgent } from "./ai/RandomAssignmentAgent";
import { LocalSearchAgent } from "./ai/LocalSearchAgent";

const agents: Agent[] = [new RandomAssignmentAgent(), new LocalSearchAgent(10), new LocalSearchAgent(1000), new SearchAgent()];

const document = stringify({ columns: ["Agent", "Products", "Orders", "Products * Orders", "Runtime (ms)", "Evaluation"], header: true });
const file = fs.createWriteStream("tests.csv");
document.pipe(file);
document.pipe(process.stdout);
fc.assert(fc.property(arbitraryProblem(4), ([orders, inventory]) => {

  const orderInfo: string =
    `Customer stats:
    Total number of orders: ${orders.length}
    Number of products per order (avg, min, max): ${orders.reduce((a, b) => a + b.size, 0) / orders.length}, ${orders.reduce((a, b) => Math.min(a, b.size), Infinity)}, ${orders.reduce((a, b) => Math.max(a, b.size), 0)}
    Number of allergies per customer (avg, min, max): ${orders.reduce((a, b) => a + b.customer.allergies.size, 0) / orders.length}, ${orders.reduce((a, b) => Math.min(a, b.customer.allergies.size), Infinity)}, ${orders.reduce((a, b) => Math.max(a, b.customer.allergies.size), 0)}
    Average preference per customer (avg, min, max): ${orders.reduce((a, b) => a + b.customer.averagePreference(), 0) / orders.length}, ${orders.reduce((a, b) => Math.min(a, b.customer.averagePreference()), Infinity)}, ${orders.reduce((a, b) => Math.max(a, b.customer.averagePreference()), 0)}
      `;

  // print the problem
  console.log(
    `\n\n\nProblem Stats:
  ${inventory.toString()}
  ${orderInfo}`
  );


  agents.forEach(agent => {
    const start = new Date().getTime();
    const finalState = agent.assign(List(orders), inventory, defaultFeatureVectors);
    const duration = new Date().getTime() - start;
    //document.write([agent.name, inventory.products().size, orders.length, inventory.products().size * orders.length, duration, finalState.evaluate(defaultFeatureVectors)]);
    console.log(`${agent.name} took ${duration}ms to assign ${inventory.products().size} products (${finalState.toResult().assignment.numAssigned()} / ${orders.reduce((acc, order) => acc + order.size, 0)}) to ${orders.length} orders with evaluation ${finalState.evaluate(defaultFeatureVectors)}`);
  })
}), { numRuns: 100 });
document.end();
