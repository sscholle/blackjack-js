/**
 * BlackJack 21 Game Logic and test case runner
 * @author Sebastian Scholle
 * @license Apache-2.0
 */
class BlackJack {
    static CARD_ACE = 'Ace';
    static CARD_TWO = 'Two';
    static CARD_THREE = 'Three';
    static CARD_FOUR = 'Four';
    static CARD_FIVE = 'Five';
    static CARD_SIX = 'Six';
    static CARD_SEVEN = 'Seven';
    static CARD_EIGHT = 'Eight';
    static CARD_NINE = 'Nine';
    static CARD_TEN = 'Ten';
    static CARD_JACK = 'Jack';
    static CARD_QUEEN = 'Queen';
    static CARD_KING = 'King';
    static PLAYER_DEALER = 'Dealer';

    /**
     * Starts executing the game logic and prints results to console
     */
    run(testCase){
        const dealerHand = this.resolveHand(BlackJack.PLAYER_DEALER, testCase[BlackJack.PLAYER_DEALER]);
        const players = Object.keys(testCase)
            .filter(key => key !== BlackJack.PLAYER_DEALER)
            .map(playerKey => this.resolveHand(playerKey, testCase[playerKey], dealerHand));
            
        console.log('-- NEW TEST CASE --');
        console.log(BlackJack.PLAYER_DEALER, dealerHand.value);
        players.forEach(player => {
            console.log(player.name, player.value, player.result)
        });
    }

    /**
     * Runs the code BlackJack game logic over a hand of cards, with optional dealers results to compare to
     * @param {string} name name of the hand/player
     * @param {array} hand a list of cards in this hand
     * @param {object} dealerResult the output from 'resolveHand' for the Dealer, this will allow wins/losses to be recorded in the final result
     */
    resolveHand(name, hand, dealerResult = null){
        const playerResult = {
            name,
            value: 0,
            result: null,
        };
        const numberOfAces = hand.filter(item => item === BlackJack.CARD_ACE).length;

        // 5-Hand - Win!
        if(hand.length === 5 && this.getCardSum(hand) <= 21){
            playerResult.value = '-';
            playerResult.result = 'beats dealer (5 cards)';

        // Hand has Aces - must calculate hand sums until we get a good maximum value
        } else if(numberOfAces) {
            const numberOfVariations = numberOfAces * numberOfAces - 1; // imaginary: work out how many card sum variations can exist
            let currentValue = 0;
            let variationCheckCount = 0;
            // iterate over the possible card-sum-variations (changing the ace value each time) until 
            // start using Ace max values to see if we can get closer to 21
            while(variationCheckCount < numberOfVariations){
                const newValue = this.getCardSum(hand, variationCheckCount++);
                if(newValue > 21){
                    break;// this variation went too far - use previous 'currentValue' in the result
                }
                currentValue = newValue;
            }
            playerResult.value = currentValue;

        // Default - just get hand points
        }else {
            playerResult.value = this.getCardSum(hand);
        }
        
        if(dealerResult){
            if(playerResult.value > 21 || dealerResult.value > playerResult.value){
                playerResult.result = 'loses';
            }else if(dealerResult.value == playerResult.value){
                playerResult.result = 'draw';
            }else{
                playerResult.result = playerResult.result || 'beats dealer';
            }
        }
        return playerResult;
    }

    /**
     * Sums the values of the hand, allows aces to be used in their min or max value version
     * @param {array} playerCards a hand of cards
     * @param {number} numberOfAcesToMaxValues the number of aces in the hand that should be used for maximum card value
     */
    getCardSum(playerCards, numberOfAcesToMaxValues = 0){
        let acesLeft = numberOfAcesToMaxValues;
        return playerCards
            .map(card => this.getCardValues(card, acesLeft-- ? true : false))
            .reduce((pv, cv) => pv + cv, 0);
    }

    /**
     * Get the equivalent points value of the card
     * @param {BlackJack.CARD_*} card any card defined in the BlackJack class
     * @param {boolean} highValueAce should the aces high value be returned, if applicable
     */
    getCardValues(card, highValueAce = false){
        switch(card){
            case BlackJack.CARD_ACE:
                return highValueAce ? 11 : 1;
            case BlackJack.CARD_TWO:
                return 2;
            case BlackJack.CARD_THREE:
                return 3;
            case BlackJack.CARD_FOUR:
                return 4;
            case BlackJack.CARD_FIVE:
                return 5;
            case BlackJack.CARD_SIX:
                return 6;
            case BlackJack.CARD_SEVEN:
                return 7;
            case BlackJack.CARD_EIGHT:
                return 8;
            case BlackJack.CARD_NINE:
                return 9;
            case BlackJack.CARD_TEN:
            case BlackJack.CARD_JACK:
            case BlackJack.CARD_QUEEN:
            case BlackJack.CARD_KING:
                return 10;
            default:
                return 0;
        }
    }
}

// Ignoring Card Suit as it has not bearing on BlackJack
const exampleHands = {
    [BlackJack.PLAYER_DEALER]: [
        BlackJack.CARD_SIX,
        BlackJack.CARD_NINE,
    ],
    "Andrew": [
        BlackJack.CARD_NINE,
        BlackJack.CARD_SIX,
        BlackJack.CARD_JACK,
    ],
    "Billy": [
        BlackJack.CARD_QUEEN,
        BlackJack.CARD_KING,
    ],
    "Carla": [
        BlackJack.CARD_TWO,
        BlackJack.CARD_NINE,
        BlackJack.CARD_KING,
    ]
};

const testCase = {
    [BlackJack.PLAYER_DEALER]: [
        BlackJack.CARD_JACK,
        BlackJack.CARD_NINE,
    ],
    "Lemmy": [
        BlackJack.CARD_ACE,
        BlackJack.CARD_SEVEN,
        BlackJack.CARD_ACE,
    ],
    "Andrew": [
        BlackJack.CARD_KING,
        BlackJack.CARD_FOUR,
        BlackJack.CARD_FOUR,
    ],
    "Billy": [
        BlackJack.CARD_TWO,
        BlackJack.CARD_TWO,
        BlackJack.CARD_TWO,
        BlackJack.CARD_FOUR,
        BlackJack.CARD_FIVE
    ],
    "Carla": [
        BlackJack.CARD_QUEEN,
        BlackJack.CARD_SIX,
        BlackJack.CARD_NINE,
    ]
};

const game = new BlackJack();
game.run(exampleHands);
game.run(testCase);
