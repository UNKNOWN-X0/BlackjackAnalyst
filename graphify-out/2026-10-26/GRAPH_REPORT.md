# Graph Report - BlackjackAnalyst  (2026-10-24)

## Corpus Check
- 28 files · ~77,543 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 1, .css 1)

## Summary
- 69 nodes · 120 edges · 8 communities (5 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ce5bada2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Blackjack Rules Engine
- Application Interface and Guide
- Jekyll CI Workflow
- Simulation and Results
- Project Configuration
- CSV Export
- Project instructions
- CLAUDE.md

## God Nodes (most connected - your core abstractions)
1. `getHandValue()` - 9 edges
2. `simulateRound()` - 8 edges
3. `dealerStrategy()` - 6 edges
4. `runSimulation()` - 6 edges
5. `Monte Carlo simulation of starting hands` - 6 edges
6. `createDeck()` - 5 edges
7. `isFiveCardCharlie()` - 5 edges
8. `playerStrategy()` - 5 edges
9. `generateAllHands()` - 5 edges
10. `simulateHand()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `buildCSV()` --calls--> `getHandValue()`  [EXTRACTED]
  js/csv.js → js/rules.js
- `runSimulation()` --calls--> `generateAllHands()`  [EXTRACTED]
  js/app.js → js/simulation.js
- `runSimulation()` --calls--> `simulateHand()`  [EXTRACTED]
  js/app.js → js/simulation.js
- `generateAllHands()` --calls--> `createDeck()`  [EXTRACTED]
  js/simulation.js → js/rules.js
- `simulateRound()` --calls--> `createDeck()`  [EXTRACTED]
  js/simulation.js → js/rules.js

## Import Cycles
- None detected.

## Communities (8 total, 3 thin omitted)

### Community 0 - "Blackjack Rules Engine"
Cohesion: 0.35
Nodes (10): createDeck(), dealerStrategy(), getHandValue(), isFiveCardCharlie(), isSoftHand(), playerStrategy(), shuffleDeck(), generateAllHands() (+2 more)

### Community 1 - "Application Interface and Guide"
Cohesion: 0.17
Nodes (11): Blackjack Analyst application page, Results table and CSV export controls, Simulation mode and sample-size controls, Player and dealer rule controls, Blackjack Analyst README, Grouped and per-hand CSV export, Five-Card Charlie game mode, Fixed-threshold player and dealer strategy (+3 more)

### Community 2 - "Jekyll CI Workflow"
Cohesion: 0.14
Nodes (13): runs-on, steps, jobs, build, name, branches, branches, name (+5 more)

### Community 3 - "Simulation and Results"
Cohesion: 0.53
Nodes (6): runSimulation(), sortResults(), state, displayResults(), updateProgress(), updateUI()

### Community 4 - "Project Configuration"
Cohesion: 0.33
Nodes (5): name, private, scripts, test, type

## Knowledge Gaps
- **1 isolated node(s):** `Freshly shuffled single deck per round`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 22 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `Freshly shuffled single deck per round` to the rest of the system?**
  _1 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Jekyll CI Workflow` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
