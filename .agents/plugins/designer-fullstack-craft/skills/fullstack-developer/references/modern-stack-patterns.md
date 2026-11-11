# Modern Stack Patterns

## Clean Component Architecture
1. **Separation of Concerns**:
   - `components/`: Pure, presentation components and interactive widgets.
   - `data/`: Centralized content and metadata configurations.
   - `utils/`: Audio synthesizers, mathematical formatters, date utilities.
   - `hooks/`: Custom stateful logic (e.g. keyboard shortcuts, screen resize, local storage).

2. **Error Resiliency**:
   - Wrap interactive trees in Error Boundaries.
   - Provide graceful fallback states for network or Web Audio API unavailability.
