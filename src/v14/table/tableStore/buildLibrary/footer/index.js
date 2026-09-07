import { calculateFooter } from "./calculateFooter.js";
import { calculateRow } from "./calculateRow.js";
import types from "./types.json" with { type: "json" };

const samples = types.samples || [];

export { calculateFooter, calculateRow, types, samples };
export default calculateFooter;
