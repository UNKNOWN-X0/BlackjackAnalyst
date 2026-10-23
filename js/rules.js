export function createDeck() {
  const suits = ["♥", "♦", "♠", "♣"];
  const ranks = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
    "A",
  ];
  const deck = [];

  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ rank, suit });
    }
  }

  return deck;
}

export function shuffleDeck(deck) {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getHandValue(cards) {
  let value = 0;
  let aces = 0;

  for (const card of cards) {
    if (card.rank === "A") {
      aces += 1;
      value += 1;
    } else if (["J", "Q", "K"].includes(card.rank)) {
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

export function isSoftHand(cards) {
  let value = 0;
  let aces = 0;

  for (const card of cards) {
    if (card.rank === "A") {
      aces += 1;
      value += 1;
    } else if (["J", "Q", "K"].includes(card.rank)) {
      value += 10;
    } else {
      value += parseInt(card.rank);
    }
  }

  return aces > 0 && value + 10 <= 21;
}

// ========== STRATEGY FUNCTIONS ==========
export function playerStrategy(hand, deck, threshold) {
  const newHand = [...hand];
  const newDeck = [...deck];

  while (getHandValue(newHand) < threshold) {
    if (newDeck.length === 0) break;
    newHand.push(newDeck.pop());
  }

  return { hand: newHand, deck: newDeck };
}

export function dealerStrategy(hand, deck, threshold, hitSoft17) {
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

export function isFiveCardCharlie(hand) {
  return hand.length >= 5 && getHandValue(hand) <= 21;
}
