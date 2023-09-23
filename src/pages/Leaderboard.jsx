import React, { useContext, useEffect, useState } from "react";
// Components
import BasePage from "../components/BasePage";
import LeaderboardModal from "../components/LeaderboardModal";
// Context
import AuthContext from "../AuthContext";
// Config

// user data: rank, username, color, highScore, currentScore

const LeaderboardPage = () => {
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const [ranks, setRanks] = useState([]);
  const [page, setPage] = useState(1);
  const [resultsLength, setResultsLength] = useState(0);

  const { user } = useContext(AuthContext);

  const getLeaderboard = async () => {
    setRanks(false);
  };

  useEffect(() => {
    if (user === "pending") return;
    getLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, user]);

  return (
    <BasePage useContainer={true}>
      <LeaderboardModal
        ranks={ranks}
        setPage={setPage}
        page={page}
        resultsLength={resultsLength}
        currentUserRank={currentUserRank}
      />
    </BasePage>
  );
};

export default LeaderboardPage;
