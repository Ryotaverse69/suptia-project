// Sanity schema exports for Suptia MVP
import { ingredient } from "./ingredient";
import { product } from "./product";
import { evidence } from "./evidence";
import { rule } from "./rule";
import { persona } from "./persona";

export { ingredient, product, evidence, rule, persona };
export { deskStructure } from "./desk";

// Schema array for Sanity config
export const schemaTypes = [ingredient, product, evidence, rule, persona];
