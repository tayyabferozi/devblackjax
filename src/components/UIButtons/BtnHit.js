import React, { useEffect } from "react";
// icons
import { HitIcon } from "../../img/UiBtnIcons";
// Styling
import { PlayingBtn } from "../../Globals/GlobalStyles";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { dealersTurn, playerDrawsCard } from "../gameSlice";

const BtnHit = React.memo(() => {
  const dispatch = useDispatch();

  const {
    dealerWillPlay,
    deckOfCards: deck,
    totalHandValue: { playerHand: playerHandTotal },
  } = useSelector((store) => store.game);

  const playerHandLength = useSelector((store) => store.game.playerHand).length;

  const drawCardHandler = () => {
    dispatch(playerDrawsCard(deck));
  };

  // Dealer loop logic
  useEffect(() => {
    if (playerHandTotal > 20) {
      dispatch(dealersTurn());
    }
  }, [dispatch, playerHandTotal]);

  return (
    <PlayingBtn
      onClick={drawCardHandler}
      disabled={playerHandTotal > 20 || dealerWillPlay || playerHandLength < 2}
    >
      {HitIcon()} HIT
    </PlayingBtn>
  );
});

export default BtnHit;
