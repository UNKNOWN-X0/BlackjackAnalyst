// ========== STATE MANAGEMENT ==========
let state = {
    playerStands: 17,
    dealerStands: 17,
    dealerHitsSoft17: true,
    gameMode: 'modded',
    simulations: 1000,
    customSimulations: '',
    isRunning: false,
    results: null,
    sortColumn: 'winRate',
    sortDirection: 'desc'
};

// ========== CARD & DECK FUNCTIONS ==========
function createDeck() {
    const suits = ['♥', '♦', '♠', '♣'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const deck = [];
    
    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push({ rank, suit });
        }
    }
    
    return deck;
}

function shuffleDeck(deck) {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function getHandValue(cards) {
    let value = 0;
    let aces = 0;
    
    for (const card of cards) {
        if (card.rank === 'A') {
            aces += 1;
            value += 1;
        } else if (['J', 'Q', 'K'].includes(card.rank)) {
            value += 10;
        } else {
            value += parseInt(card.rank);
        }
    }
    
    // Optimize aces
    for (let i = 0; i < aces; i++) {
        if (value + 10 <= 21) {
            value += 10;
        }
    }
    
    return value;
}

function isSoftHand(cards) {
    let value = 0;
    let aces = 0;
    
    for (const card of cards) {
        if (card.rank === 'A') {
            aces += 1;
            value += 1;
        } else if (['J', 'Q', 'K'].includes(card.rank)) {
            value += 10;
        } else {
            value += parseInt(card.rank);
        }
    }
    
    return aces > 0 && value + 10 <= 21;
}

// ========== STRATEGY FUNCTIONS ==========
function playerStrategy(hand, deck, threshold) {
    const newHand = [...hand];
    const newDeck = [...deck];
    
    while (getHandValue(newHand) < threshold) {
        if (newDeck.length === 0) break;
        newHand.push(newDeck.pop());
    }
    
    return { hand: newHand, deck: newDeck };
}

function dealerStrategy(hand, deck, threshold, hitSoft17) {
    const newHand = [...hand];
    const newDeck = [...deck];
    
    while (true) {
        const value = getHandValue(newHand);
        const soft = isSoftHand(newHand);
        
        if (value > threshold) break;
        if (value === threshold && (!hitSoft17 || !soft)) break;
        if (newDeck.length === 0) break;
        
        newHand.push(newDeck.pop());
    }
    
    return { hand: newHand, deck: newDeck };
}

function isFiveCardCharlie(hand) {
    return hand.length >= 5 && getHandValue(hand) <= 21;
}

// ========== SIMULATION FUNCTIONS ==========
function simulateRound(startingHand, playerThreshold, dealerThreshold, hitSoft17, fiveCardCharlie) {
    let deck = shuffleDeck(createDeck());
    
    // Remove starting cards from deck
    deck = deck.filter(card => {
        for (const startCard of startingHand) {
            if (card.rank === startCard.rank && card.suit === startCard.suit) {
                return false;
            }
        }
        return true;
    });
    
    // Deal dealer hand
    const dealerHand = [deck.pop(), deck.pop()];
    
    // Player plays
    const playerHand = [...startingHand];
    const playerResult = playerStrategy(playerHand, deck, playerThreshold);
    const finalPlayerHand = playerResult.hand;
    deck = playerResult.deck;
    
    const playerValue = getHandValue(finalPlayerHand);
    
    // Check player bust
    if (playerValue > 21) {
        return 'loss';
    }
    
    // Check 5-card Charlie
    if (fiveCardCharlie && isFiveCardCharlie(finalPlayerHand)) {
        return 'win';
    }
    
    // Dealer plays
    const dealerResult = dealerStrategy(dealerHand, deck, dealerThreshold, hitSoft17);
    const finalDealerHand = dealerResult.hand;
    const dealerValue = getHandValue(finalDealerHand);
    
    // Check dealer bust
    if (dealerValue > 21) {
        return 'win';
    }
    
    // Check 5-card Charlie for dealer
    if (fiveCardCharlie && isFiveCardCharlie(finalDealerHand)) {
        return 'loss';
    }
    
    // Compare hands
    if (playerValue > dealerValue) {
        return 'win';
    } else if (playerValue < dealerValue) {
        return 'loss';
    } else {
        return 'tie';
    }
}

function generateAllHands() {
    const deck = createDeck();
    const hands = [];
    
    for (let i = 0; i < deck.length; i++) {
        for (let j = i + 1; j < deck.length; j++) {
            hands.push([deck[i], deck[j]]);
        }
    }
    
    return hands;
}

async function runSimulation() {
    if (state.isRunning) return;
    
    state.isRunning = true;
    updateUI();
    
    const simulationSelect = document.getElementById('simulationSelect');
    const customInput = document.getElementById('customSimulations');
    const actualSimulations = simulationSelect.value === 'custom' 
        ? parseInt(customInput.value) || 1000 
        : state.simulations;
    
    const allHands = generateAllHands();
    const playerThreshold = state.playerStands;
    const dealerThreshold = state.dealerStands;
    const hitSoft17 = state.dealerHitsSoft17;
    const fiveCardCharlie = state.gameMode === 'modded';
    
    const handResults = [];
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    for (let i = 0; i < allHands.length; i++) {
        const hand = allHands[i];
        let wins = 0;
        let losses = 0;
        let ties = 0;
        
        // Run simulations for this hand
        for (let j = 0; j < actualSimulations; j++) {
            const outcome = simulateRound(hand, playerThreshold, dealerThreshold, hitSoft17, fiveCardCharlie);
            if (outcome === 'win') wins++;
            else if (outcome === 'loss') losses++;
            else ties++;
        }
        
        const total = wins + losses + ties;
        const winRate = (wins / total) * 100;
        const lossRate = (losses / total) * 100;
        const tieRate = (ties / total) * 100;
        
        handResults.push({
            hand: `${hand[0].rank}${hand[0].suit} ${hand[1].rank}${hand[1].suit}`,
            handText: `${hand[0].rank}, ${hand[1].rank}`,
            cards: hand,
            winRate: winRate.toFixed(1),
            lossRate: lossRate.toFixed(1),
            tieRate: tieRate.toFixed(1),
            wins,
            losses,
            ties,
            total
        });
        
        // Update progress
        if (i % 10 === 0) {
            const progress = Math.floor((i / allHands.length) * 100);
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `Processing ${progress}% • ${actualSimulations.toLocaleString()} iterations per hand`;
            await new Promise(resolve => setTimeout(resolve, 0));
        }
    }
    
    // Sort by win rate descending initially
    state.sortColumn = 'winRate';
    state.sortDirection = 'desc';
    
    state.results = {
        hands: handResults,
        totalHands: handResults.length,
        bestHand: handResults.reduce((best, hand) => 
            parseFloat(hand.winRate) > parseFloat(best.winRate) ? hand : best
        )
    };
    
    progressFill.style.width = '100%';
    progressText.textContent = `Processing 100% • ${actualSimulations.toLocaleString()} iterations per hand`;
    
    state.isRunning = false;
    updateUI();
    displayResults();
}

// ========== SORTING FUNCTION ==========
function sortResults(column) {
    if (!state.results) return;
    
    // Toggle direction if same column, otherwise default to desc
    if (state.sortColumn === column) {
        state.sortDirection = state.sortDirection === 'desc' ? 'asc' : 'desc';
    } else {
        state.sortColumn = column;
        state.sortDirection = 'desc';
    }
    
    const hands = state.results.hands;
    
    hands.sort((a, b) => {
        let aVal, bVal;
        
        if (column === 'hand') {
            aVal = a.handText;
            bVal = b.handText;
            const comparison = aVal.localeCompare(bVal);
            return state.sortDirection === 'desc' ? -comparison : comparison;
        } else {
            // Numeric columns
            if (['winRate', 'lossRate', 'tieRate'].includes(column)) {
                aVal = parseFloat(a[column]);
                bVal = parseFloat(b[column]);
            } else {
                aVal = a[column];
                bVal = b[column];
            }
            
            if (state.sortDirection === 'desc') {
                return bVal - aVal;
            } else {
                return aVal - bVal;
            }
        }
    });
    
    displayResults();
}

// ========== UI UPDATE FUNCTIONS ==========
function updateUI() {
    const runButton = document.getElementById('runButton');
    const runButtonText = document.getElementById('runButtonText');
    const progressContainer = document.getElementById('progressContainer');
    const exportButton = document.getElementById('exportButton');
    
    if (state.isRunning) {
        runButton.disabled = true;
        runButtonText.textContent = 'Running...';
        progressContainer.style.display = 'flex';
        exportButton.style.display = 'none';
    } else {
        runButton.disabled = false;
        runButtonText.textContent = 'Run';
        if (state.results) {
            progressContainer.style.display = 'none';
            exportButton.style.display = 'flex';
        }
    }
    
    // Update simulation count text
    const simulationSelect = document.getElementById('simulationSelect');
    const customInput = document.getElementById('customSimulations');
    const actualSims = simulationSelect.value === 'custom' 
        ? parseInt(customInput.value) || 1000 
        : state.simulations;
    document.getElementById('simulationCount').textContent = actualSims.toLocaleString();
    
    // Update ruleset display
    document.getElementById('rulePlayerStands').textContent = state.playerStands;
    document.getElementById('ruleDealerStands').textContent = state.dealerStands;
    document.getElementById('ruleSoft17').textContent = state.dealerHitsSoft17 ? 'Yes' : 'No';
    document.getElementById('ruleCharlie').textContent = state.gameMode === 'modded' ? 'Enabled' : 'Disabled';
    
    // Update notice
    const noticeTitle = document.getElementById('noticeTitle');
    const noticeDesc = document.getElementById('noticeDesc');
    if (state.gameMode === 'modded') {
        noticeTitle.textContent = '5-Card Charlie Active';
        noticeDesc.textContent = 'Five Card Charlie is enabled. Win 5-card non-bust hands.';
    } else {
        noticeTitle.textContent = 'Standard Rules';
        noticeDesc.textContent = 'Playing with traditional blackjack rules.';
    }
}

function displayResults() {
    const emptyState = document.getElementById('emptyState');
    const resultsTable = document.getElementById('resultsTable');
    const resultsTableBody = document.getElementById('resultsTableBody');
    const resultsInfo = document.getElementById('resultsInfo');
    const bestHandCard = document.getElementById('bestHandCard');
    
    if (!state.results) {
        emptyState.style.display = 'block';
        resultsTable.style.display = 'none';
        bestHandCard.style.display = 'none';
        return;
    }
    
    emptyState.style.display = 'none';
    resultsTable.style.display = 'block';
    bestHandCard.style.display = 'block';
    
    // Update results info
    resultsInfo.innerHTML = `Sorted by Win Rate (Desc) • <span class="highlight">Total Hands Analyzed: ${state.results.totalHands}</span>`;
    
    // Update best hand
    const bestHand = state.results.bestHand;
    document.getElementById('bestCard1').textContent = `${bestHand.cards[0].rank}${bestHand.cards[0].suit}`;
    document.getElementById('bestCard2').textContent = `${bestHand.cards[1].rank}${bestHand.cards[1].suit}`;
    document.getElementById('bestWinRate').textContent = `${bestHand.winRate}%`;
    document.getElementById('bestWinCount').textContent = `${bestHand.wins} / ${bestHand.total} Wins`;
    
    // Update sort indicators
    document.querySelectorAll('.sortable').forEach(th => {
        th.classList.remove('active', 'asc', 'desc');
        if (th.dataset.sort === state.sortColumn) {
            th.classList.add('active', state.sortDirection);
        }
    });
    
    // Build table
    resultsTableBody.innerHTML = '';
    state.results.hands.forEach(hand => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${hand.hand}</td>
            <td class="text-right win-rate">${hand.winRate}%</td>
            <td class="text-right loss-rate">${hand.lossRate}%</td>
            <td class="text-right tie-rate">${hand.tieRate}%</td>
            <td class="text-right result-count">${hand.wins}</td>
            <td class="text-right result-count">${hand.losses}</td>
            <td class="text-right result-count">${hand.ties}</td>
            <td class="text-right result-count">${hand.total}</td>
            <td class="text-right">
                <div class="visual-bars">
                    <div class="bar bar-win" style="width: ${hand.winRate}%" title="Win: ${hand.winRate}%"></div>
                    <div class="bar bar-loss" style="width: ${hand.lossRate}%" title="Loss: ${hand.lossRate}%"></div>
                    <div class="bar bar-tie" style="width: ${hand.tieRate}%" title="Tie: ${hand.tieRate}%"></div>
                </div>
            </td>
        `;
        resultsTableBody.appendChild(row);
    });
}

function exportCSV() {
    if (!state.results) return;
    
    let csv = 'Hand,Win %,Loss %,Tie %,Wins,Losses,Ties,Total\n';
    state.results.hands.forEach(hand => {
        csv += `"${hand.hand}",${hand.winRate},${hand.lossRate},${hand.tieRate},${hand.wins},${hand.losses},${hand.ties},${hand.total}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'blackjack-simulation.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

// ========== EVENT LISTENERS ==========
document.addEventListener('DOMContentLoaded', () => {
    // Player Stands
    document.getElementById('playerStands').addEventListener('change', (e) => {
        state.playerStands = parseInt(e.target.value);
        updateUI();
    });
    
    // Dealer Stands
    document.getElementById('dealerStands').addEventListener('change', (e) => {
        state.dealerStands = parseInt(e.target.value);
        updateUI();
    });
    
    // Dealer Hits Soft 17 Toggle
    document.getElementById('dealerHitsSoft17Toggle').addEventListener('click', (e) => {
        state.dealerHitsSoft17 = !state.dealerHitsSoft17;
        e.currentTarget.classList.toggle('active');
        updateUI();
    });
    
    // Game Mode Buttons
    document.getElementById('classicMode').addEventListener('click', () => {
        state.gameMode = 'classic';
        document.getElementById('classicMode').classList.add('active');
        document.getElementById('moddedMode').classList.remove('active');
        updateUI();
    });
    
    document.getElementById('moddedMode').addEventListener('click', () => {
        state.gameMode = 'modded';
        document.getElementById('moddedMode').classList.add('active');
        document.getElementById('classicMode').classList.remove('active');
        updateUI();
    });
    
    // Simulation Select
    document.getElementById('simulationSelect').addEventListener('change', (e) => {
        const customInputGroup = document.getElementById('customInputGroup');
        if (e.target.value === 'custom') {
            customInputGroup.style.display = 'flex';
        } else {
            customInputGroup.style.display = 'none';
            state.simulations = parseInt(e.target.value);
            updateUI();
        }
    });
    
    // Back to Presets
    document.getElementById('backToPresets').addEventListener('click', () => {
        document.getElementById('simulationSelect').value = '1000';
        document.getElementById('customInputGroup').style.display = 'none';
        state.simulations = 1000;
        updateUI();
    });
    
    // Custom Simulations Input
    document.getElementById('customSimulations').addEventListener('input', () => {
        updateUI();
    });
    
    // Run Button
    document.getElementById('runButton').addEventListener('click', runSimulation);
    
    // Export Button
    document.getElementById('exportButton').addEventListener('click', exportCSV);
    
    // Sortable Headers
    document.querySelectorAll('.sortable').forEach(th => {
        th.addEventListener('click', () => {
            sortResults(th.dataset.sort);
        });
    });
    
    // Initial UI update
    updateUI();
});
