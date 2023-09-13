"use client";
import { useMemo, useCallback } from "react";
import calculateWinner from "./util";

export default function Board({
  dispatch,
  squares,
  boardNumber,
  isPlayable,
  lastPlay,
}) {
  const [winner, winLine] = useMemo(() => calculateWinner(squares), [squares]);

  let handleClick = useCallback(
    i => {
      dispatch({
        type: "PLAY",
        payload: {
          boardNumber,
          squareClicked: i,
        },
      });
    },
    [dispatch, boardNumber]
  );

  // always highlight the last clicked square in the current game
  let highlightLastPlay = useCallback(
    squ => {
      return lastPlay && lastPlay === squ;
    },
    [lastPlay]
  );

  return (
    <div className={`container ${!winner ? "" : "small-shake"}`}>
      <div
        className={`board center ${
          isPlayable && !winner ? "current-board" : ""
        }`}>
        {[1, 2, 3].map(i => (
          <div key={i} className="board-row">
            {[1, 2, 3].map(j => {
              const sq = (i - 1) * 3 + (j - 1);
              const isWin = winLine && winLine.includes(sq);

              return (
                <button
                  key={`sq-${sq}`}
                  className={`square${isWin ? ` highlight-win-${winner}` : ""}${
                    highlightLastPlay(sq) ? " highlight-last" : ""
                  }`}
                  onClick={() => handleClick(sq)}>
                  {squares[sq]}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
