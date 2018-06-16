// Work with HTML and Javascript

/*
let textArea = document.getElementById('text-area');

textArea.innerText = 'Nuevo Texto ';

let okButton = document.getElementById('ok-button')

textArea.style.display = 'none';

okButton.addEventListener ('click',function(){
    textArea.style.display = 'block';
});
*/



//
// Blackjack 
// By Ulises Lugo  
//

// TODOS Add Bets, add animations ( card images, money, table), Add split

// Card Variables
let suits = ['Hearts','Clubs','Diamonds','Spades'],
    values = ['Ace', 'King', 'Queen', 'Jack', 'Ten', 'Nine', 'Eight','Seven', 'Six','Five','Four','Three','Two'];

//DOM Variables
let textArea = document.getElementById('text-area'),
    newGameButton = document.getElementById('new-game-button'),
    hitButton = document.getElementById('hit-button'),
    stayButton = document.getElementById('stay-button'),
    splitButton = document.getElementById('split-button');

//Game variables
let gameStarted=false,
    gameOver=false,
    playerWon= false,
    twinCards = false,
    splitted = false;
    dealerCards= [],
    playerCards = [],
    dealerScore = 0,
    playerScore = 0,
    deck = [];

hitButton.style.display = 'none';
stayButton.style.display = 'none';
splitButton.style.display = 'none';

showStatus();

newGameButton.addEventListener('click',function(){
    gameStarted = true;
    gameOver = false;

    deck = createDeck();
    shuffleDeck(deck);
    dealerCards = [ getNextCard(), getNextCard() ];
    playerCards = [ getNextCard(), getNextCard() ];
    
    if(getScore(playerCards)==21){
        playerWon = true;
        gameOver = true;
    }
    else{
        newGameButton.style.display = 'none';
        hitButton.style.display = 'inline';
        stayButton.style.display= 'inline';
        if(getCardNumericValue(playerCards[0]) === getCardNumericValue(playerCards[1])){
            splitButton.style.display= 'inline';
            twinCards = true;
        }

    }
    showStatus();
});

hitButton.addEventListener('click',function(){
    playerCards.push(getNextCard());
    if(twinCards){
        splitButton.style.display = 'none';
    }
    checkForEndOfGame();
    showStatus();
});

stayButton.addEventListener('click',function(){
    gameOver = true;
    if(twinCards){
        splitButton.style.display = 'none';
    }
    checkForEndOfGame();
    showStatus();
});

splitButton.addEventListener('click',function(){
    splitted = true;
    createSecondDeck();
    splitButton.style.display= 'none';
});

// Create deck of cards
function createDeck(){
    let deck=[];

    for(let suitIdx=0; suitIdx<suits.length ; suitIdx++){

        for(let valuesIdx=0;valuesIdx<values.length;valuesIdx++){
            let card = {
                suit: suits[suitIdx],
                value: values[valuesIdx]
            };
            deck.push(card);
        }
    
    }

    return deck;
}

function createSecondDeck(){
    let playerCards2 = [playerCards[1]];
    playerCards[1] = getNextCard();
    playerCards2.push(getNextCard());
}

function getCardString(card){
    return card.value + ' of ' + card.suit;
}

function getCardNumericValue(card){
    switch(card.value){
        case 'Ace':
            return 1;
        case 'Two':
            return 2;
        case 'Three':
            return 3;
        case 'Four':
            return 4;
        case 'Five':
            return 5;
        case 'Six':
            return 6;
        case 'Seven':
            return 7;
        case 'Eight':
            return 8;
        case 'Nine':
            return 9;
        default:
            return 10;
    }
}

function getScore(cardArray){
    let score=0;
    let hasAce= false;
    for(let i=0; i < cardArray.length; i++){
        let card = cardArray[i];
        score += getCardNumericValue(card);
        if(card.value=='Ace'){
            hasAce = true;
        }
    }

    if(hasAce && score + 10 <= 21){
        return score + 10;
    }
    return score;
}

function updateScores(pCards){
    dealerScore = getScore(dealerCards);
    playerScore = getScore(pCards);
}

function checkForEndOfGame(){

    updateScores();

    if(gameOver){
        //let dealer take cards
        while(dealerScore < playerScore
              && playerScore <= 21
              && dealerScore <= 17){
            dealerCards.push(getNextCard());
            updateScores();
        }
    }
    //Conditions to Win or Lose
    if(playerScore > 21){
        playerWon = false;
        if(!splitted)
        gameOver = true;
    }
    else if(playerCards.length == 5){
        playerWon = true;
        gameOver= true;
    }
    else if( dealerScore > 21){
        playerWon = true;
        gameOver= true;
    }
    else if( dealerCards.length == 5){
        playerWon = false;
        gameOver = true;
    }
    else if(gameOver){

        if(playerScore > dealerScore) {
            playerWon = true;
        }
        else{
            playerWon = false;
        }

    }
}

function showStatus(){
    if(!gameStarted){
        textArea.innerText = ' Welcome to Blackjack!';
        return;
    }
    let dealerCardString= '';
    for(let i=1; i < dealerCards.length; i++){
        dealerCardString += getCardString(dealerCards[i]) + '\n';
    }

    let dealerFirstCard = getCardString(dealerCards[0]) + '\n';

    let playerCardString = '';
    for(let i=0; i<playerCards.length;i++){
        playerCardString +=  getCardString(playerCards[i]) + '\n';
    }

    updateScores();

    
    if(gameOver){
        //Show dealer's cards
        textArea.innerText =
        'Dealer has:\n ' +
        dealerFirstCard +
        dealerCardString +
        '(score: '+ dealerScore + ')\n\n' +

        'Player has:\n' +
        playerCardString +
        '(score: '+ playerScore + ')\n\n';

        if(playerWon){
            textArea.innerText += "YOU WIN!!";
        }
        else{
            textArea.innerText += "DEALER WINS";
        }
        newGameButton.style.display = 'inline';
        hitButton.style.display = 'none';
        stayButton.style.display= 'none';
        splitButton.style.display = 'none';
    }
    // If the game isn't over don't show the dealer's first card
    else{
        textArea.innerText =
        'Dealer has:\n Hiden \n' +
        dealerCardString +
        '\n\n' +

        'Player has:\n' +
        playerCardString +
        '(score: '+ playerScore + ')\n\n';
    }
    
}

function getNextCard() {
    return deck.shift();
}

function shuffleDeck(deck){
    
    for(let i=0;i<deck.length; i++){
        let swapIdx = Math.trunc(Math.random()*deck.length);
        let tmp = deck[swapIdx];
        deck[swapIdx]= deck[i];
        deck[i] = tmp;
    }
}



