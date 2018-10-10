class AudioController {
    constructor() {
        this.bgMusic = new Audio('Assets/Audio/creepy.mp3');
        this.flipSound = new Audio('Assets/Audio/flip.wav');
        this.matchSound = new Audio('Assets/Audio/match.wav');
        this.victorySound = new Audio('Assets/Audio/victory.wav');
        this.gameoverSound = new Audio('Assets/Audio/gameover.wav');
        this.bgMusic.volume = 0.5;
    }
    startMusic() {
        this.bgMusic.play();
        this.bgMusic.loop = true;
    }
    stopMusic() {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    }
    flip() {
        this.flipSound.play();
    }
    match() {
        this.matchSound.play();
    }
    victory() {
        this.stopMusic();
        this.victorySound.play();
    }
    gameover() {
        this.stopMusic();
        this.gameoverSound.play();
    }
}

class MixOrMatch {
    constructor(totalTime, cards) {
        this.cardsArray = cards;
        this.timeRemaining = totalTime;
        this.countdown = null;
        this.cardClickCount = 0;
        this.busy = false;
        this.timer = document.getElementById('time-remaining')
        this.ticker = document.getElementById('flips');
        this.totalClicks = 0;
        this.ticker.innerText = this.totalClicks; // Didn't want to put this in reset() so that the player can see their score after victory or gameover.
        this.cardToCheck = null;
        this.matchedCards = [];
        this.audioController = new AudioController();
    }

    startGame() {
        this.audioController.startMusic();
        this.shuffleCards(this.cardsArray);
        this.countdown = this.startCountdown();
    }
    startCountdown() {
        this.timer.innerText = this.timeRemaining;
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if(this.timeRemaining === 0)
                this.gameOver();
        }, 1000);
    }
    gameOver() {
        this.reset();
        clearInterval(this.countdown);
        this.audioController.gameover();
        document.getElementsByClassName('game-over-text')[0].classList.add('visible');
    }
    victory() {
        this.reset();
        clearInterval(this.countdown);
        this.audioController.victory();
        document.getElementsByClassName('victory-text')[0].classList.add('visible');
    }
    reset() {
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched');
        });
    }
    flipCard(card) {
        if(this.canFlipCard(card)) {
            this.audioController.flip();
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            card.classList.add('visible');

            if(this.cardToCheck) {
                this.checkForCardMatch(card);
            } else {
                this.cardToCheck = card;
            }
        }
    }
    checkForCardMatch(card) {
        if(this.getCardType(card) === this.getCardType(this.cardToCheck))
            this.cardMatch(card, this.cardToCheck);
        else 
            this.cardMismatch(card, this.cardToCheck);

        this.cardToCheck = null;
    }
    cardMatch(card1, card2) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        this.audioController.match();
        if(this.matchedCards.length === this.cardsArray.length)
            this.victory();
    }
    cardMismatch(card1, card2) {
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 1000);
    }
    shuffleCards(cardsArray) {
        for (let i = cardsArray.length - 1; i > 0; i--) {
            const randIndex = Math.floor(Math.random() * (i + 1));
            [cardsArray[i], cardsArray[randIndex]] = [cardsArray[randIndex], cardsArray[i]];
        }
        cardsArray = cardsArray.map((card, index) => {
            card.style.order = index;
        });
    }
    getCardType(card) {
        let cardFront = card.children[1];
        return cardFront.children[cardFront.children.length-1].src;
    }
    canFlipCard(card) {
        if(this.busy || this.matchedCards.includes(card) || card === this.cardToCheck)
            return false;
        return true;
    }
}

class GameManager {
    constructor() {
        this.overlays = Array.from(document.getElementsByClassName('overlay-text'));
        this.cards = Array.from(document.getElementsByClassName('card'));
        this.init();
    }
    init() {
        this.overlays.forEach(overlay => {
            overlay.addEventListener('click', () => {
                overlay.classList.remove('visible');
                this.play();
            });
        });
        this.cards.forEach(card => {
            card.addEventListener('click', () => {
                this.game.flipCard(card);
            });
        });
    }
    play() {
        this.game = new MixOrMatch(100, this.cards);
        this.game.startGame();
    }
}

let gameManager = new GameManager();
