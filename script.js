// Still more features to add. Timer, match counter, and game over screen.


let cardToMatch;
let cards = document.getElementsByClassName('card');
let cardsArray = Array.from(cards);
let matchedCards = [];
let checking = false;
let gameInterval;
let cardClickCount = 0;

function backgroundMusic() {
    let music = new Audio('Assets/Audio/creepy.mp3');
    music.play();
    music.addEventListener('ended', () => {
        music.currentTime = 0;
        music.play();
    });
}
function checkForVictory() {
    if (cardsArray.length === matchedCards.length) {
        clearInterval(gameInterval);
    }  
}
function clickCard(card) {
    if(checking || card === cardToMatch || matchedCards.includes(card)) return;
    if(cardClickCount === 0) startGame();
    cardClickCount++;
    document.getElementById('flips').innerHTML = cardClickCount;
    card.classList.add('visible');
    if(cardToMatch) {
        checkForCardMatch(card);
    } else {
        cardToMatch = card;
    }
}
function checkForCardMatch(card) {
    if(cardToMatch.dataset['cardType'] === card.dataset['cardType']) {
        cardToMatch.classList.add('matched');
        card.classList.add('matched');
        matchedCards.push(card);
        matchedCards.push(cardToMatch);
        cardToMatch = null;
        checkForVictory();
    } else {
        checking = true;
         setTimeout(() => {
            cardToMatch.classList.remove('visible');
            card.classList.remove('visible');
            cardToMatch = null;
            checking = false;
        }, 1000);
    }
}
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
function init() {
    shuffle(cardsArray);
    for(let i = 0; i < cardsArray.length; i++) {
        cardsArray[i].style.order = i;
        setCardAttribute(cardsArray[i]);
        cardsArray[i].addEventListener('click', () => {
            clickCard(cardsArray[i]);
        });
    }
    countdown();
}
function startGame() {
    backgroundMusic();
}
function setCardAttribute(card) {
    let cardFront = card.children[1];
    let cardFrontImage = cardFront.children[cardFront.children.length-1].src;

    if(cardFrontImage.includes('Skull'))
        card.dataset['cardType'] = 'skull';
    else if(cardFrontImage.includes('Bat'))
        card.dataset['cardType'] = 'bat';
    else if(cardFrontImage.includes('Dracula'))
        card.dataset['cardType'] = 'dracula';
    else if(cardFrontImage.includes('Bones'))
        card.dataset['cardType'] = 'bones';
    else if(cardFrontImage.includes('Pumpkin'))
        card.dataset['cardType'] = 'pumpkin';
    else if(cardFrontImage.includes('Ghost'))
        card.dataset['cardType'] = 'ghost';
    else if(cardFrontImage.includes('Cauldron'))
        card.dataset['cardType'] = 'cauldron';
    else if(cardFrontImage.includes('Eye'))
        card.dataset['cardType'] = 'eye';
}

function countdown()  {
    let timer = document.getElementById('time-remaining');
    let timeRemaining = 100;
    timer.innerText = timeRemaining;
    gameInterval = setInterval(() => {
        timeRemaining--;
        timer.innerText = timeRemaining;
    }, 1000);
}

init();