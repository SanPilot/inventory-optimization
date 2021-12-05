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

const agents: Agent[] = [new RandomAssignmentAgent(), new LocalSearchAgent(10), new SearchAgent()];

const document = stringify({ columns: ["Agent", "Products", "Orders", "Products * Orders", "Runtime (ms)", "Evaluation"], header: true });
const file = fs.createWriteStream("tests.csv");
document.pipe(file);
document.pipe(process.stdout);
fc.assert(fc.property(arbitraryProblem(4), ([orders, inventory]) => {
  agents.forEach(agent => {
    const start = new Date().getTime();
    const finalState = agent.assign(List(orders), inventory, defaultFeatureVectors);
    const duration = new Date().getTime() - start;
    document.write([agent.name, inventory.products().size, orders.length, inventory.products().size * orders.length, duration, finalState.evaluate(defaultFeatureVectors)]);
  })
}), { numRuns: 100 });
document.end();
