const cardsData = {
  suits: ["H", "C", "D", "S"],

  value: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"],

  // place holder
  img: [
    "https://media.discordapp.net/attachments/711222589892329516/824924384560283648/Google_marker.png",
  ],
};

const deckOfCards = [];

const findRealValue = (value) => {
  if (Number(value)) {
    return Number(value);
  }
  if (value === "J" || value === "Q" || value === "K") {
    return 10;
  }
  if (value === "A") {
    return 1;
  }
};

const createDeck = () => {
  cardsData.suits.forEach((suit) => {
    cardsData.value.forEach((value) => {
      deckOfCards.push({
        suit,
        value,
        rv: findRealValue(value),
      });
    });
  });
};

createDeck();
createDeck();

export default deckOfCards;
