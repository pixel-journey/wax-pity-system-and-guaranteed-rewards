# wax-pity-system-and-guaranteed-rewards — Pity System & Guaranteed Rewards

> **Status:** 🔒 Private (In Development) | Target Public Release: July 2026  
> **Category:** Atomic Ecosystem & Drop Mechanics (WAX-Specific)  
> **Parent Catalog:** [pixel-journey/wax-ecosystem-blueprint-catalog](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog)

**One-sentence goal:** Tools and examples for implementing pity systems and guaranteed rewards in Atomic Drops on WAX to create fair and engaging player experiences.

---

## 1. Overview & Goal

This blueprint delivers practical tools, code examples, and best practices for implementing pity systems and guaranteed rewards in Atomic Drops on WAX. It helps creators design fair, engaging, and sustainable drop mechanics that keep players invested over time.

**Why it matters for WAX/Antelope:**
- Basic random drops can feel unfair or frustrating without pity mechanics.
- Pity systems and guaranteed rewards significantly improve player retention and satisfaction.
- Clear patterns help developers implement these features correctly and transparently.

**Target users:**
- Game developers implementing loot/drop systems
- NFT project creators running drops and packs
- Anyone wanting to create fair and engaging reward mechanics

**Success metrics:**
- Clear, production-ready patterns for pity and guaranteed rewards
- Transparent and fair-feeling mechanics
- 95+ Lighthouse scores
- High adoption in drop-based projects

---

## 2. Concepts & Inspiration

### Core Blockchain Concepts
- **Pity systems**: Increasing the probability of rare rewards after repeated failures (e.g., after X attempts without a rare item).
- **Guaranteed rewards**: Ensuring a specific reward after a defined number of attempts or under certain conditions.
- **Dynamic probability adjustment**: Changing drop rates based on player history or global state.
- **Transparency**: Clearly communicating how pity and guarantees work to build player trust.

### User Pain Points Addressed
- Random drops without pity feel unfair and can lead to frustration or churn.
- Implementing pity and guaranteed rewards from scratch is complex and error-prone.
- Players often don't understand or trust opaque drop mechanics.

### Inspirations
- Traditional: Gacha and loot box systems in games with pity timers (e.g., many mobile games).
- Web3: Advanced NFT drop mechanics in successful projects with transparent pity systems.
- Design: Clear probability displays and satisfying reward experiences.

**Related Blueprints (synergy):**
- Direct companion to `wax-advanced-drop-mechanics-toolkit` and `wax-drops-and-pack-opening-experience`.
- Supports gamification and engagement tooling.

---

## 3. Design Specifications (Pixel Journey Standards)

### 3.1 Visual & Interaction Design
- **Overall layout**: Clean toolkit interface with sections for pity system configuration, guaranteed reward setup, and probability simulation. Interactive simulators for testing mechanics. Professional yet engaging aesthetic.
- **Color palette**: Professional indigo with vibrant accents for rewards and clear probability visualizations.
- **Micro-interactions**: Smooth probability updates in simulators, satisfying reward previews, clear feedback on pity progress.
- **Responsive**: Excellent desktop for detailed configuration; mobile-friendly summary views.

### 3.2 Key Views / Components
- `PitySystemConfig.tsx` — Interface for configuring pity rules (trigger thresholds, probability curves).
- `GuaranteedRewardSetup.tsx` — Tools for defining guaranteed rewards and conditions.
- `ProbabilitySimulator.tsx` — Interactive simulator showing how pity and guarantees affect outcomes over time.
- `TransparencyPanel.tsx` — Examples of how to clearly communicate mechanics to players.
- `CodeExamples.tsx` — Ready-to-use code snippets for common pity and guarantee implementations.

### 3.3 Accessibility (A11y) & Inclusive Design
- WCAG 2.2 AA: Clear visualizations with patterns and text labels, keyboard navigation, high-contrast states.
- Screen reader friendly: Structured announcements of probabilities and pity progress.

### 3.4 Performance & Optimization Targets
- Lighthouse 95+
- Fast simulation of pity and guarantee mechanics
- Smooth interactive configuration
- Efficient handling of complex rules

---

## 4. Technical Architecture

### 4.1 Core Tech Stack (Standardized)
- **Framework:** Next.js 15 (App Router) + TypeScript (strict)
- **Styling:** Tailwind CSS + shadcn/ui + framer-motion
- **State & Data:** @tanstack/react-query + zod + Jotai
- **Blockchain Data:** AtomicAssets for drop configuration and claiming
- **Simulation Engine:** Client-side logic for modeling pity and guarantee outcomes
- **Utilities:** date-fns, lucide-react, sonner

### 4.2 Data Flow Diagram
```
Configure pity rules and guaranteed rewards
    ↓
Run client-side simulation to test outcomes
    ↓
Generate on-chain configuration or claiming logic
    ↓
Implement transparency and player communication
    ↓
Deploy and monitor drop performance
```

### 4.3 Folder Structure
```
app/
├── (pity)/
│   └── page.tsx                 # Main pity system and guaranteed rewards toolkit
├── components/
│   ├── pity/
│   │   ├── PitySystemConfig.tsx
│   │   ├── GuaranteedRewardSetup.tsx
│   │   ├── ProbabilitySimulator.tsx
│   │   ├── TransparencyPanel.tsx
│   │   └── CodeExamples.tsx
├── lib/
│   ├── pity/
│   │   ├── pity-engine.ts
│   │   └── guarantee-manager.ts
│   └── utils.ts
├── types/
│   └── pity-system.ts
public/
└── mock-drops/                  # Sample drop configurations with pity and guarantees for demo
```

### 4.4 Security & Privacy Notes
- All simulation is client-side
- On-chain claiming uses standard secure patterns
- Clear guidance on transparent communication to players

---

## 5. Implementation Examples & Code Snippets

### 1. Pity system logic
```ts
// lib/pity/pity-engine.ts
export function calculatePityProbability(baseRate, attemptsSinceLastRare) {
  // Increase probability based on failed attempts
  return adjustedRate;
}
```

### 2. Guaranteed reward handling
```ts
// Track attempts and force reward after threshold
if (attempts >= guaranteeThreshold) {
  // Award guaranteed item
}
```

---

## 6. Demo & Testing Strategy

- **Interactive Simulators:** Pity system and probability calculators
- **Storybook** for components and examples
- **Playwright** e2e: configure pity/guarantees → simulate → view outcomes
- **Vitest** for simulation logic
- Vercel previews

---

## 7. Roadmap & Development Phases

**Phase 0 — Scaffold (1–2 days)**
- Next.js + Tailwind + basic simulator structure

**Phase 1 — Core Logic (4–5 days)**
- Pity engine, guarantee manager, probability simulation, transparency patterns

**Phase 2 — Core UI (4 days)**
- Configuration tools, simulators, transparency panel, code examples

**Phase 3 — Polish (2 days)**
- Performance, a11y, responsive, beautiful visualizations

**Phase 4 — Documentation & Release (2 days)**
- Full README, screenshots, AI prompt pack, make public

**Future Enhancements**
- Integration with advanced drop mechanics toolkit
- Advanced anti-abuse mechanisms for pity systems
- Analytics for pity system performance
- Community-contributed pity and guarantee templates

---

## 8. Visual References & Mockups

**Key Screen:**
Clean toolkit with interactive pity system simulator. Users can adjust parameters and see how probabilities change over attempts. Clear documentation and copyable code examples. Professional yet engaging aesthetic.

> *Feels like a premium game design tool meets calm Web3 interface — fair, transparent, and practical.*

**ASCII Sketch:**
```
[ Pity System Configuration ]
Base Rate: 5%
Pity Trigger: After 10 failed attempts
Guaranteed Item: After 50 attempts

     Probability Simulator
After 10 attempts: 12%
After 20 attempts: 25%

[ Generate Code ]
```

---

## 9. Related Blueprints & Ecosystem Fit

- Direct companion to `wax-advanced-drop-mechanics-toolkit` and `wax-drops-and-pack-opening-experience`.
- Supports advanced gamification and engagement features.
- Excellent reference for game developers on WAX.

---

## 10. License, Contributing & Credits

- MIT License
- Built with ❤️ for fair and engaging drop mechanics on WAX
- Focus on practical, transparent patterns
- Pixel Journey Design System for clarity and engagement
- Special thanks to the focus on Atomic ecosystem depth

**This blueprint makes pity systems and guaranteed rewards fair, transparent, and easy to implement.**

*Pixel Journey — Beautiful interfaces for public blockchain data.*

---

*Last updated: July 02, 2026*