import fc from "fast-check";
import { SearchAgent } from "./ai";
import {List} from "immutable";
import { stringify } from "csv";
import { arbitraryProblem } from "./generator";
import fs from "fs";

const agent = new SearchAgent();

const document = stringify({columns: ["Products", "Orders", "Products * Orders", "Runtime (ms)"], header: true});
const file = fs.createWriteStream("tests.csv");
document.pipe(file);
document.pipe(process.stdout);
fc.assert(fc.property(arbitraryProblem(4), ([orders, inventory]) => {
  const start = new Date().getTime();
  const assignment = agent.assign(List(orders), inventory);
  const duration = new Date().getTime() - start;
  document.write([inventory.products().size, orders.length, inventory.products().size * orders.length, duration]);
}), {numRuns: 100});
document.end();
