// Shared application state, updated by the entry point and results controls.
export const state = {
  playerStands: 17,
  dealerStands: 17,
  dealerHitsSoft17: true,
  gameMode: "modded",
  simulations: 1000,
  customSimulations: "",
  isRunning: false,
  results: null,
  sortColumn: "winRate",
  sortDirection: "desc",
};
