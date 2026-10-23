import { state } from "./state.js";
import { generateAllHands, simulateHand } from "./simulation.js";
import { updateUI, displayResults, updateProgress } from "./ui.js";
import { sortResults } from "./results.js";
import { exportCSV } from "./csv.js";

async function runSimulation() {
  if (state.isRunning) return;

  state.isRunning = true;
  updateUI();

  const simulationSelect = document.getElementById("simulationSelect");
  const customInput = document.getElementById("customSimulations");
  const actualSimulations =
    simulationSelect.value === "custom"
      ? parseInt(customInput.value) || 1000
      : state.simulations;

  const allHands = generateAllHands();
  const playerThreshold = state.playerStands;
  const dealerThreshold = state.dealerStands;
  const hitSoft17 = state.dealerHitsSoft17;
  const fiveCardCharlie = state.gameMode === "modded";

  const handResults = [];
  const startedAt = performance.now();
  let lastUpdate = startedAt;
  updateProgress(0, allHands.length, actualSimulations, 0);
  // Let the browser paint the reset state before starting work.
  await new Promise((resolve) => setTimeout(resolve, 0));

  for (let i = 0; i < allHands.length; i++) {
    const hand = allHands[i];
    handResults.push(
      simulateHand(
        hand,
        actualSimulations,
        playerThreshold,
        dealerThreshold,
        hitSoft17,
        fiveCardCharlie,
      ),
    );

    // Yield between hands based on time, so large presets update more often.
    const now = performance.now();
    if (now - lastUpdate >= 50 || i === allHands.length - 1) {
      updateProgress(
        i + 1,
        allHands.length,
        actualSimulations,
        now - startedAt,
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
      lastUpdate = performance.now();
    }
  }

  // Sort by win rate descending initially
  state.sortColumn = "winRate";
  state.sortDirection = "desc";

  state.results = {
    hands: handResults,
    totalHands: handResults.length,
    bestHand: handResults.reduce((best, hand) =>
      parseFloat(hand.winRate) > parseFloat(best.winRate) ? hand : best,
    ),
  };

  updateProgress(
    allHands.length,
    allHands.length,
    actualSimulations,
    performance.now() - startedAt,
    true,
  );

  state.isRunning = false;
  updateUI();
  displayResults();
}

document.addEventListener("DOMContentLoaded", () => {
  // Player Stands
  document.getElementById("playerStands").addEventListener("change", (e) => {
    state.playerStands = parseInt(e.target.value);
    updateUI();
  });

  // Dealer Stands
  document.getElementById("dealerStands").addEventListener("change", (e) => {
    state.dealerStands = parseInt(e.target.value);
    updateUI();
  });

  // Dealer Hits Soft 17 Toggle
  document
    .getElementById("dealerHitsSoft17Toggle")
    .addEventListener("click", (e) => {
      state.dealerHitsSoft17 = !state.dealerHitsSoft17;
      e.currentTarget.classList.toggle("active");
      updateUI();
    });

  // Game Mode Buttons
  document.getElementById("classicMode").addEventListener("click", () => {
    state.gameMode = "classic";
    document.getElementById("classicMode").classList.add("active");
    document.getElementById("moddedMode").classList.remove("active");
    updateUI();
  });

  document.getElementById("moddedMode").addEventListener("click", () => {
    state.gameMode = "modded";
    document.getElementById("moddedMode").classList.add("active");
    document.getElementById("classicMode").classList.remove("active");
    updateUI();
  });

  // Simulation Select
  document
    .getElementById("simulationSelect")
    .addEventListener("change", (e) => {
      const customInputGroup = document.getElementById("customInputGroup");
      if (e.target.value === "custom") {
        customInputGroup.style.display = "flex";
      } else {
        customInputGroup.style.display = "none";
        state.simulations = parseInt(e.target.value);
        updateUI();
      }
    });

  // Back to Presets
  document.getElementById("backToPresets").addEventListener("click", () => {
    document.getElementById("simulationSelect").value = "1000";
    document.getElementById("customInputGroup").style.display = "none";
    state.simulations = 1000;
    updateUI();
  });

  // Custom Simulations Input
  document.getElementById("customSimulations").addEventListener("input", () => {
    updateUI();
  });

  // Run Button
  document.getElementById("runButton").addEventListener("click", runSimulation);

  // Export Button
  document
    .getElementById("exportButton")
    .addEventListener("click", () => exportCSV(state.results));

  // Sortable Headers
  document.querySelectorAll(".sortable").forEach((th) => {
    th.addEventListener("click", () => {
      sortResults(th.dataset.sort);
    });
  });

  // Initial UI update
  updateUI();
});
