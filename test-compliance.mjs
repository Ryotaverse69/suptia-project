import { checkCompliance } from './apps/web/src/lib/compliance/checker.ts';
import { COMPLIANCE_RULES } from './apps/web/src/lib/compliance/rules.ts';

console.log('COMPLIANCE_RULES length:', COMPLIANCE_RULES.length);
console.log('First rule:', JSON.stringify(COMPLIANCE_RULES[0], null, 2));

const result = checkCompliance("この商品で糖尿病が治ります");
console.log('\nTest result:', JSON.stringify(result, null, 2));
