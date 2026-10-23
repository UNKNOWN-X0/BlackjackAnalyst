import { createDeck, shuffleDeck, getHandValue, playerStrategy, dealerStrategy, isFiveCardCharlie } from './rules.js';

export function simulateRound(startingHand, playerThreshold, dealerThreshold, hitSoft17, fiveCardCharlie) {
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

export function generateAllHands() {
    const deck = createDeck();
    const hands = [];
    
    for (let i = 0; i < deck.length; i++) {
        for (let j = i + 1; j < deck.length; j++) {
            hands.push([deck[i], deck[j]]);
        }
    }
    
    return hands;
}

export function simulateHand(hand, actualSimulations, playerThreshold, dealerThreshold, hitSoft17, fiveCardCharlie) {
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
        
        return {
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
        };
}
