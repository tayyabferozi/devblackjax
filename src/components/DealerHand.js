import React from "react";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
// Components
import Card from "./Card";
import { StyledHand } from "../Globals/GlobalStyles";

// Styling
import styled from "styled-components";
// Animation
// import { motion } from "framer-motion";

const DealerHand = () => {
  const dealerHand = useSelector((store) => store.game.dealerHand);

  const cards = dealerHand.map((card, index) => {
    return (
      <Card
        suit={card.suit}
        value={card.value}
        index={index}
        handLength={dealerHand.length}
        key={uuidv4()}
        isPlayersHand={false}
      />
    );
  });

  return (
    <StyledHand
      className="dealerHand"
      style={{
        width: `${14.5 + 4 * (cards.length - 1)}rem`,
        transition: "all 0.5s cubic-bezier(0.47, 0.03, 0.45, 0.99)",
        transitionDelay: "0.2s",
      }}
    >
      {cards
        ? cards.map((card, index) => {
            return (
              <Card1 key={uuidv4()} style={{ left: `${index * 4}rem` }}>
                {card}
              </Card1>
            );
          })
        : ""}
    </StyledHand>
  );
};

const Card1 = styled.div`
  position: absolute;
  left: 0;
  z-index: 10;
`;

export default DealerHand;
