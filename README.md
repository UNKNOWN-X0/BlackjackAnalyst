# Blackjack Analyst - Probability & Strategy Calculator

A comprehensive Monte Carlo simulation tool for analyzing blackjack starting hand probabilities and optimal strategies.

## 🎯 Overview

Blackjack Analyst uses Monte Carlo simulation to analyze all **1,326 possible starting hand combinations** in blackjack. The tool helps you understand win rates, loss rates, and tie probabilities under different table rules and game modes.

## ✨ Features

- **Monte Carlo Simulation**: Run 100 to 100,000+ simulations per hand
- **All Possible Hands**: Analyzes all 1,326 two-card starting combinations
- **Flexible Rules**: Customize player/dealer stand thresholds and soft 17 rules
- **Game Modes**:
  - **Classic**: Standard blackjack rules
  - **Modded**: Includes 5-Card Charlie rule (automatic win with 5 cards under 21)
- **Detailed Results**: View win/loss/tie percentages and counts for every hand
- **Best Hand Identification**: Automatically highlights the highest-performing starting hand
- **Sortable Data**: Click column headers to sort by any metric
- **CSV Export**: Export both summary and detailed data for further analysis

## 🚀 Getting Started

### Installation

1. Download all three files:
   - `index.html`
   - `styles.css`
   - `script.js`

2. Place them in the same folder

3. Open `index.html` in a web browser

No server or dependencies required - runs entirely in your browser!

## 📊 How to Use

### 1. Configure Table Rules

**Player Stands On**: Set when the player stops hitting (default: Hard 17)
- Options range from Hard 12 to Hard 20

**Dealer Stands On**: Set when the dealer stops hitting (default: 17)
- Options range from 12 to 20

**Dealer Hits Soft 17**: Toggle whether dealer hits on soft 17
- Enabled by default (increases house edge slightly)

### 2. Choose Game Mode

**Classic Mode**: Traditional blackjack rules

**Modded Mode**: Includes 5-Card Charlie
- Any 5-card hand that doesn't bust automatically wins
- Both player and dealer can achieve 5-Card Charlie

### 3. Set Simulation Count

Choose simulation iterations per hand:
- **100** - Fast preview
- **1,000** - Standard accuracy (default)
- **10,000** - Detailed analysis
- **100,000** - Maximum precision
- **Custom** - Enter any amount

### 4. Run Simulation

1. Click the **"Run"** button
2. Watch the progress bar as all 1,326 hands are analyzed
3. Results appear automatically when complete

### 5. Analyze Results

The results table shows for each hand:
- **Hand**: The two starting cards
- **Win %**: Percentage of wins
- **Loss %**: Percentage of losses
- **Tie %**: Percentage of ties
- **Win/Loss/Tie #**: Actual counts
- **Total**: Total simulations run
- **Visual**: Color-coded bar chart

**Click any column header to sort the data!**

### 6. Export Data

Click **"Export CSV"** to download results in CSV format.

The export contains two sections:

#### Section 1: Grouped by Starting Total (Summary)
Aggregated data showing mean percentages for each starting hand value (4-21):
- Starting Total (e.g., 12, 13, 14...)
- Count of hand combinations with that total
- Mean Win/Loss/Tie percentages
- Total wins, losses, ties, and simulations

#### Section 2: Detailed Hand Data
Complete data for all 1,326 individual hand combinations:
- Specific cards (e.g., "A♠ K♥")
- Win/Loss/Tie percentages
- Win/Loss/Tie counts
- Total simulations

## 🎲 Simulation Logic

### Monte Carlo Method

For each of the 1,326 possible starting hands:
1. Remove the starting cards from a fresh deck
2. Deal two cards to the dealer
3. Player plays according to the threshold rule
4. Dealer plays according to their rules
5. Determine winner
6. Repeat for the specified number of simulations

**The deck is completely reshuffled between each simulation** to ensure statistical independence.

### Win/Loss/Tie Conditions

**Win**:
- Player total > Dealer total (both under 22)
- Dealer busts
- Player achieves 5-Card Charlie (if enabled)

**Loss**:
- Player busts
- Dealer total > Player total (both under 22)
- Dealer achieves 5-Card Charlie (if enabled)

**Tie**:
- Player total == Dealer total (both under 22)

### Hand Value Calculation

- Number cards: Face value (2-10)
- Face cards (J, Q, K): 10 points
- Ace: 1 or 11 (automatically optimized to highest non-bust value)

### Soft Hands

A hand is "soft" when it contains an Ace counted as 11. The "Dealer Hits Soft 17" rule specifically applies when the dealer has 17 with an Ace counting as 11 (e.g., A-6).

## 📈 Understanding the Results

### Best Performing Hand

The "Best Performing Hand" card shows which starting hand has the highest win rate under your configured rules. Typically, this is a natural blackjack (Ace + 10-value card).

### Starting Total Analysis

Hands are grouped by their starting total (4-21). Generally:
- **20-21**: Highest win rates (especially blackjack at 21)
- **17-19**: Good win rates, stand immediately
- **12-16**: Most challenging ("bust zone")
- **4-11**: Must hit, but can't bust on next card

### 5-Card Charlie Impact

When enabled, 5-Card Charlie significantly improves win rates for:
- Lower starting totals (4-11)
- Hands that would normally require multiple hits

## 🎨 Visual Features

- **Golden theme**: Premium casino aesthetic
- **Color-coded results**: 
  - Green for wins
  - Red for losses
  - Gray for ties
- **Interactive table**: Hover effects and sorting
- **Progress tracking**: Real-time simulation progress
- **Responsive design**: Works on desktop and mobile

## 📁 File Structure

```
blackjack-analyst/
├── index.html      # Main HTML structure
├── styles.css      # All styling and animations
└── script.js       # Simulation logic and UI control
```

## 🔧 Technical Details

- **Total Combinations**: 1,326 (52 choose 2)
- **Deck Composition**: 52 cards (4 suits × 13 ranks)
- **Language**: Pure JavaScript (ES6+)
- **No Dependencies**: No external libraries required
- **Browser Compatibility**: Modern browsers (Chrome, Firefox, Safari, Edge)

## 💡 Tips for Best Results

1. **Start with 1,000 simulations** for quick initial analysis
2. **Use 10,000+ simulations** for statistical significance
3. **Compare different rulesets** to see how they affect probabilities
4. **Export data** for deeper analysis in spreadsheet software
5. **Sort by different columns** to discover patterns

## 📊 Sample Use Cases

- **Strategy Development**: Find which starting hands perform best
- **Rule Comparison**: See how different table rules affect outcomes
- **Educational**: Learn blackjack probabilities and mechanics
- **Research**: Generate data for statistical analysis
- **Game Design**: Test variant rules and their impact

## ⚠️ Limitations

- Simulations assume perfect basic strategy for the configured thresholds
- Does not include:
  - Splitting pairs
  - Doubling down
  - Insurance/side bets
  - Card counting strategies
  - Multi-deck shoes (each simulation uses fresh single deck)
  - Dealer peeking for blackjack

## 🎓 Educational Value

This tool demonstrates:
- **Probability theory**: Large numbers law and statistical convergence
- **Monte Carlo methods**: Simulation-based problem solving
- **Data visualization**: Presenting complex data clearly
- **Game theory**: Optimal strategy under different rules

## 📝 License

This project is open source and free to use for educational and personal purposes.

## 🤝 Contributing

Feel free to modify and enhance the code for your own needs!

---

**Enjoy analyzing blackjack probabilities!** 🃏♠️♥️♣️♦️
