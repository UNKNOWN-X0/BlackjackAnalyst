import { state } from './state.js';

export function updateUI() {
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
            progressContainer.style.display = 'flex';
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

export function displayResults() {
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

// Progress is presentation only; round simulation and game rules stay independent.
export function updateProgress(completed, total, iterations, elapsedMs, finished = false) {
    const container = document.getElementById('progressContainer');
    const bar = document.getElementById('simulationProgress');
    const percent = Math.floor((completed / total) * 100);
    const formatTime = ms => {
        const seconds = Math.max(0, Math.round(ms / 1000));
        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ${seconds % 60}s`;
        return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
    };

    container.dataset.complete = String(finished);
    document.getElementById('progressFill').style.width = `${percent}%`;
    bar.setAttribute('aria-valuenow', String(percent));
    bar.setAttribute('aria-valuetext', `${completed.toLocaleString()} of ${total.toLocaleString()} starting hands completed`);
    document.getElementById('progressText').textContent = finished
        ? 'Complete — 100%'
        : completed === total ? 'Preparing results…' : `Analyzing hands — ${percent}%`;
    document.getElementById('progressDetail').textContent =
        `${completed.toLocaleString()} / ${total.toLocaleString()} hands · ${iterations.toLocaleString()} rounds per hand`;

    const remaining = completed > 0 && elapsedMs >= 1000
        ? `About ${formatTime(elapsedMs / completed * (total - completed))} remaining`
        : 'Estimating time remaining…';
    document.getElementById('progressTiming').textContent = finished
        ? `${(total * iterations).toLocaleString()} rounds completed in ${formatTime(elapsedMs)}`
        : `${formatTime(elapsedMs)} elapsed · ${remaining}`;
    // Announce only the start and finish, not every visual refresh.
    if (completed === 0 || finished) {
        document.getElementById('progressAnnouncement').textContent = finished
            ? `Simulation complete. ${total.toLocaleString()} starting hands analyzed.`
            : 'Simulation started.';
    }
}
