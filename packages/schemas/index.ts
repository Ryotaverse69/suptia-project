// Sanity schema exports for Suptia MVP
import { ingredient } from "./ingredient";
import { product } from "./product";
import { brand } from "./brand";
import { evidence } from "./evidence";
import { rule } from "./rule";
import { persona } from "./persona";
import { complianceRule } from "./compliance-rule";
import { additive } from "./additive";

export {
  ingredient,
  product,
  brand,
  evidence,
  rule,
  persona,
  complianceRule,
  additive,
};
export { deskStructure } from "./desk";

// Schema array for Sanity config
export const schemaTypes = [
  ingredient,
  product,
  brand,
  evidence,
  rule,
  persona,
  complianceRule,
  additive,
];
