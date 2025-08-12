# Implementation Plan

- [ ] 1. Create core scoring engine with weighted calculation logic
  - Create apps/web/src/lib/scoring.ts with TypeScript interfaces for ScoreResult, ScoreComponents, and ScoreWeights
  - Implement main score(product) function that returns complete scoring result
  - Implement applyWeights function with default weights (evidence:0.35, safety:0.30, cost:0.20, practicality:0.15)
  - Add normalizeScore utility function for value normalization (0-100 range)
  - Add proper error handling for missing or invalid product data
  - _Requirements: 1.1, 1.2, 5.1, 5.2_

- [ ] 2. Implement individual scoring algorithms for each component
  - Implement calculateEvidenceScore function with evidence level, study count, and study quality factors
  - Implement calculateSafetyScore function with side effects, drug interactions, and contraindications factors
  - Implement calculateCostScore function with market comparison and cost per mg factors
  - Implement calculatePracticalityScore function with dosing frequency, form factor, and container size factors
  - Add ScoreBreakdown interface and detailed factor explanations for each component
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 6.1, 6.2_

- [ ] 3. Create comprehensive unit tests for scoring logic
  - Set up test file lib/__tests__/scoring.test.ts with complete test coverage
  - Write tests for main score function with complete and partial product data
  - Write tests for each individual scoring function (evidence, safety, cost, practicality)
  - Write tests for weight application and score normalization functions
  - Write tests for error handling scenarios (missing data, invalid values, boundary conditions)
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 5.4_

- [ ] 4. Create ScoreDisplay component with visual score representation
  - Create components/ScoreDisplay.tsx with proper TypeScript interfaces
  - Implement total score display with progress bar and numerical value
  - Implement individual component scores with weighted percentages
  - Add color-coded scoring (excellent=green, good=blue, fair=yellow, poor=red)
  - Implement responsive design for mobile and desktop layouts
  - _Requirements: 1.3, 4.1, 4.2_

- [ ] 5. Create ScoreBreakdown component for detailed score explanation
  - Create components/ScoreBreakdown.tsx for detailed score factor display
  - Implement expandable/collapsible breakdown sections for each component
  - Add factor-level explanations and calculation details
  - Implement visual representation of factor weights and contributions
  - Add missing data indicators and explanations when data is incomplete
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 6.1, 6.2, 6.3_

- [ ] 6. Create component tests for score display UI
  - Set up test files for ScoreDisplay and ScoreBreakdown components
  - Write tests for score visualization with different score ranges
  - Write tests for responsive behavior and mobile layout
  - Write tests for color coding and visual indicators
  - Write tests for missing data handling and error states
  - _Requirements: 3.1, 3.2, 4.1, 4.2, 4.3_

- [ ] 7. Integrate scoring system into products/[slug] page
  - Update or create app/products/[slug]/page.tsx to include scoring components
  - Add logic to extract product data and calculate scores on page load
  - Implement score caching with useMemo for performance optimization
  - Add error boundaries for scoring calculation failures
  - Ensure scores display prominently on the product detail page
  - _Requirements: 1.1, 1.3, 5.1, 6.4_

- [ ] 8. Add accessibility features and performance optimizations
  - Implement ARIA attributes for score displays (role="progressbar", aria-label)
  - Add keyboard navigation support for expandable score breakdowns
  - Implement screen reader optimizations for score announcements
  - Add loading states and skeleton UI for score calculations
  - Optimize rendering performance with React.memo and proper dependency arrays
  - _Requirements: 4.4, 6.4_