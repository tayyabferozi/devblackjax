import React, { useState, useEffect } from "react";
// Components
import Board from "../components/Board";
import BettingScreen from "../components/BettingScreen";
import BtnHelp from "../components/UIButtons/BtnHelp";
import BasePage from "../components/BasePage";
import GoBackBtn from "../components/UIButtons/BtnGoBack";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { setCardShuffledBoolFalse } from "../components/gameSlice";
// Styling
import styled from "styled-components";
// Animation
import { motion, AnimatePresence } from "framer-motion";

function Gamin() {
  const [showBettingScreen, setShowBettingScreen] = useState(true);

  const { cardsShuffled } = useSelector((state) => state.game);

  const dispatch = useDispatch();

  const gaminPageAnimation = {
    initial: {
      x: 1300,
    },
    animate: {
      x: 0,
      transition: {
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const messageAnim = {
    initial: {
      y: -60,
      opacity: 0,
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        ease: "easeInOut",
      },
    },
  };

  useEffect(() => {
    if (cardsShuffled) {
      setTimeout(() => {
        dispatch(setCardShuffledBoolFalse());
      }, 3000);
    }

    return () => {};
  }, [dispatch, cardsShuffled]);

  return (
    <BasePage>
      <StyledGamin
        variants={gaminPageAnimation}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <GoBackBtnContainer>
          <GoBackBtn />
        </GoBackBtnContainer>
        <ContainerOutOfBoundsBtns>
          <BtnHelp />
        </ContainerOutOfBoundsBtns>
        <AnimatePresence>
          <Board
            setShowBettingScreen={setShowBettingScreen}
            showBettingScreen={showBettingScreen}
          />
          {showBettingScreen ? (
            <BettingScreen
              key="modal"
              setShowBettingScreen={setShowBettingScreen}
              showBettingScreen={showBettingScreen}
            />
          ) : (
            ""
          )}
          {cardsShuffled ? (
            <Message
              variants={messageAnim}
              initial="initial"
              animate="animate"
              exit="initial"
              key="message"
            >
              🃏 The cards has been shuffled!
            </Message>
          ) : (
            ""
          )}
        </AnimatePresence>
      </StyledGamin>
    </BasePage>
  );
}

const ContainerOutOfBoundsBtns = styled(motion.div)`
  @media only screen and (max-width: 67em) {
    display: none;
  }
`;

const Message = styled(motion.div)`
  position: absolute;
  top: 2rem;
  font-size: 2rem;
  font-weight: 600;
  color: #8b4f00;

  padding: 0.5rem 1.5rem;
  background-image: ${(props) => props.theme.borderGold};
  border: 3px solid #b38300;
  border-radius: 0.4rem;
  z-index: 100;
`;

const GoBackBtnContainer = styled.div`
  @media only screen and (max-width: 67em) {
    display: none;
  }
`;

const StyledGamin = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  overflow: hidden;
`;

export default Gamin;
