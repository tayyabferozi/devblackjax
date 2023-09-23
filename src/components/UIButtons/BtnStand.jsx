import React, { useEffect, useCallback, useState, useContext } from "react";
// Styling
import { PlayingBtn } from "../../Globals/GlobalStyles";
// Icons
import { StandIcon } from "../../img/UiBtnIcons";
// REDUX
import { useDispatch, useSelector } from "react-redux";
import {
  dealerDrawsCard,
  distributeCards,
  dealersTurn,
  outputResults,
  concludeGame,
  shuffleCards,
} from "../gameSlice";
import AuthContext from "../../AuthContext";

const BtnStand = ({ setShowBettingScreen, showBettingScreen }) => {
  const dispatch = useDispatch();

  // STATES
  const [buttonClicked, setButtonClicked] = useState(false);
  const [dealerLoopBool, setDealerLoopBool] = useState(false);
  const [pause, setPause] = useState(false);

  // Context
  const { setGamePlayed } = useContext(AuthContext);

  const {
    results,
    dealerWillPlay,
    deckOfCards: deck,
    totalHandValue: {
      dealerHand: dealerHandTotal,
      playerHand: playerHandTotal,
    },
  } = useSelector((store) => store.game);

  const playerHandLength = useSelector((state) => state.game.playerHand).length;

  //////////////////////// FUNCTIONS

  // DEALER DRAWS CARD
  const dealerLoop = useCallback(
    (time = 5) => {
      setTimeout(() => {
        dispatch(dealerDrawsCard(deck));
      }, time * 1000);
    },
    [dispatch, deck]
  );

  const startDealerLoop = (time = 5) => {
    setTimeout(() => setDealerLoopBool(true), time * 1000);
  };

  // RESET ROUND
  const resetRound = useCallback(
    (time = 5) => {
      setTimeout(() => {
        setDealerLoopBool(false);
        setShowBettingScreen(true);
        dispatch(concludeGame());
        setGamePlayed(true); // used to trigger update
      }, time * 1000);
    },
    [dispatch, setShowBettingScreen, setGamePlayed]
  );

  // START NEXT ROUND
  const dealCards = useCallback(
    (time = 5) => {
      setTimeout(() => {
        dispatch(distributeCards(deck));
      }, time * 1000);
    },
    [dispatch, deck]
  );

  // SHOWING RESULTS POPUP
  const dipatchResults = useCallback(
    (time = 5) => {
      setTimeout(() => {
        dispatch(outputResults(playerHandTotal, dealerHandTotal));
        setButtonClicked(false);
      }, time * 1000);
      resetRound(4);
    },
    [playerHandTotal, resetRound, dealerHandTotal, dispatch]
  );

  // onClick handler
  const toggle = () => {
    setButtonClicked(true);
    dispatch(dealersTurn());
  };

  // Dealer loop logic
  useEffect(() => {
    // Step by step game logic
    if (pause) return;
    if (deck.length < 60 && results !== "none") {
      setTimeout(() => dispatch(shuffleCards()), 4000);
    } else if (playerHandLength < 2 && !showBettingScreen) {
      dealCards(0.5);
    } else if (
      (dealerHandTotal < 17 && buttonClicked && !dealerLoopBool) ||
      (dealerHandTotal < 17 && dealerWillPlay && !dealerLoopBool)
    ) {
      startDealerLoop(0.5);
    } else if (
      (dealerHandTotal < 17 && buttonClicked && dealerLoopBool) ||
      (dealerHandTotal < 17 && dealerWillPlay && dealerLoopBool)
    )
      dealerLoop(0.75);
    else if (dealerHandTotal > 0 && dealerWillPlay && results === "none") {
      dipatchResults(1.5);
    }
  });

  useEffect(() => {
    setPause(false);
    return () => {
      setPause(true);
    };
  }, [setPause]);

  return (
    <PlayingBtn
      onClick={toggle}
      disabled={
        playerHandLength < 2 ||
        buttonClicked ||
        playerHandTotal < 1 ||
        playerHandTotal > 20 ||
        results !== "none"
      }
    >
      {StandIcon()} STAND
    </PlayingBtn>
  );
};

export default React.memo(BtnStand);
