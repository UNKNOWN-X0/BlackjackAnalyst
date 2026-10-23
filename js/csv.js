import { getHandValue } from './rules.js';

export function buildCSV(results) {
    let csv = '';
    
    // Group hands by starting total value
    const groupedByTotal = {};
    
    results.hands.forEach(hand => {
        const startingTotal = getHandValue(hand.cards);
        
        if (!groupedByTotal[startingTotal]) {
            groupedByTotal[startingTotal] = [];
        }
        groupedByTotal[startingTotal].push(hand);
    });
    
    // Calculate mean percentages for each group
    csv += 'GROUPED BY STARTING TOTAL\n';
    csv += 'Starting Total,Count,Mean Win %,Mean Loss %,Mean Tie %,Total Wins,Total Losses,Total Ties,Total Simulations\n';
    
    // Sort by starting total (4 to 21)
    const sortedTotals = Object.keys(groupedByTotal).map(Number).sort((a, b) => a - b);
    
    sortedTotals.forEach(total => {
        const hands = groupedByTotal[total];
        const count = hands.length;
        
        let totalWinRate = 0;
        let totalLossRate = 0;
        let totalTieRate = 0;
        let totalWins = 0;
        let totalLosses = 0;
        let totalTies = 0;
        let totalSimulations = 0;
        
        hands.forEach(hand => {
            totalWinRate += parseFloat(hand.winRate);
            totalLossRate += parseFloat(hand.lossRate);
            totalTieRate += parseFloat(hand.tieRate);
            totalWins += hand.wins;
            totalLosses += hand.losses;
            totalTies += hand.ties;
            totalSimulations += hand.total;
        });
        
        const meanWinRate = (totalWinRate / count).toFixed(2);
        const meanLossRate = (totalLossRate / count).toFixed(2);
        const meanTieRate = (totalTieRate / count).toFixed(2);
        
        csv += `${total},${count},${meanWinRate},${meanLossRate},${meanTieRate},${totalWins},${totalLosses},${totalTies},${totalSimulations}\n`;
    });
    
    // Add separator
    csv += '\n\nDETAILED HAND DATA\n';
    
    // Original detailed data
    csv += 'Hand,Win %,Loss %,Tie %,Wins,Losses,Ties,Total\n';
    results.hands.forEach(hand => {
        csv += `"${hand.hand}",${hand.winRate},${hand.lossRate},${hand.tieRate},${hand.wins},${hand.losses},${hand.ties},${hand.total}\n`;
    });
    
    return csv;
}

export function exportCSV(results) {
    if (!results) return;
    const csv = buildCSV(results);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'blackjack-simulation-complete.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}
