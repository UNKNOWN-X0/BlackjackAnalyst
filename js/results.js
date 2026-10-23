import { state } from "./state.js";
import { displayResults } from "./ui.js";

export function sortResults(column) {
  if (!state.results) return;

  // Toggle direction if same column, otherwise default to desc
  if (state.sortColumn === column) {
    state.sortDirection = state.sortDirection === "desc" ? "asc" : "desc";
  } else {
    state.sortColumn = column;
    state.sortDirection = "desc";
  }

  const hands = state.results.hands;

  hands.sort((a, b) => {
    let aVal, bVal;

    if (column === "hand") {
      aVal = a.handText;
      bVal = b.handText;
      const comparison = aVal.localeCompare(bVal);
      return state.sortDirection === "desc" ? -comparison : comparison;
    } else {
      // Numeric columns
      if (["winRate", "lossRate", "tieRate"].includes(column)) {
        aVal = parseFloat(a[column]);
        bVal = parseFloat(b[column]);
      } else {
        aVal = a[column];
        bVal = b[column];
      }

      if (state.sortDirection === "desc") {
        return bVal - aVal;
      } else {
        return aVal - bVal;
      }
    }
  });

  displayResults();
}
