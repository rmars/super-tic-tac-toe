"use client";
import { useReducer, createContext } from "react";
import Board from "./board";
import calculateWinner from "./util";

// https://legacy.reactjs.org/docs/hooks-faq.html#how-to-avoid-passing-callbacks-down
const BoardDispatch = createContext(null);

const newGameState = {
  xIsNext: true,
  currentPlayer: "X",
  squares: Array(9).fill(Array(9).fill(null)),
  lastPlay: Array(9).fill(null),
  lastPlayedSquare: null,
  boardToPlay: null,
  boardResults: Array(9).fill(null),
  winner: null,
  winLine: null,
};

export default function SuperBoard() {
  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "PLAY":
          let { boardNumber, squareClicked } = action.payload;
          let { squares, lastPlayedSquare, boardResults, currentPlayer } =
            state;

          if (state.winner) {
            // game has been won/drawn; can't play anywhere
            return state;
          }

          // check if board is valid to play on
          if (
            lastPlayedSquare !== null &&
            // if the last played square would direct you to a board that has
            // already been won, you can play anywhere
            boardResults[lastPlayedSquare] === null &&
            lastPlayedSquare != boardNumber
          ) {
            console.warn(
              `${currentPlayer} tried to play on board ${boardNumber}. Must play on board: ${lastPlayedSquare}`
            );
            return state;
          }

          // check if board has already been won
          if (boardResults[boardNumber]) {
            return state;
          }

          // check if square has already been played on
          if (squares[boardNumber][squareClicked]) {
            return state; // if we already played here, do nothing
          }

          // make the move
          let newLastPlay = Array(9).fill(null);
          newLastPlay[boardNumber] = squareClicked;

          let newBoard = squares[boardNumber].slice(); // copy array before modifying
          newBoard[squareClicked] = currentPlayer;

          let newSquares = [
            ...squares.slice(0, boardNumber),
            newBoard,
            ...squares.slice(boardNumber + 1, squares.length),
          ];

          // see if this play results in a win on that board
          const [boardWinner, _winningLine] = calculateWinner(newBoard);
          let newBoardResults = boardResults.slice();
          if (boardWinner) {
            newBoardResults[boardNumber] = boardWinner;
          }

          // see if this play results in a win on the superboard
          const [winner, winLine] = calculateWinner(newBoardResults);

          return {
            ...state,
            xIsNext: !state.xIsNext,
            currentPlayer: state.xIsNext ? "O" : "X",
            squares: newSquares,
            lastPlay: newLastPlay,
            lastPlayedSquare: squareClicked,
            boardToPlay:
              newBoardResults[squareClicked] !== null ? null : squareClicked,
            boardResults: newBoardResults,
            winner,
            winLine,
          };
        case "RESET":
          if (action.payload.mustConfirm) {
            if (window.confirm("Leave this game and reset all game state?")) {
              return newGameState;
            }
            // otherwise, do nothing
            return state;
          }
          return newGameState;
      }
    },
    {
      xIsNext: true,
      currentPlayer: "X",
      // store the board state (9 tic tac toe boards)
      squares: Array(9).fill(Array(9).fill(null)),
      // lastPlay stores both the sub-board where the last play occurred, and
      // the square of that sub-board on which it occurred. For example, if I
      // played in square 0 (first square) of board 4 (middle board), lastPlay
      // would look like:
      // [null, null, null, 0, null, null, null, null, null]
      lastPlay: Array(9).fill(null),
      // the last played square tells us which board is currently allowable to
      // play on
      lastPlayedSquare: null,
      boardToPlay: null,
      // store the results of each sub-board. If the second and third boards
      // have been won by player X, and the eighth board drawn, boardResults
      // would look like:
      // [null, "X", "X", null, null, null, null, null, "D"]
      boardResults: Array(9).fill(null),
      winner: null,
      winLine: null,
    }
  );

  return (
    <BoardDispatch.Provider value={dispatch}>
      <div className="center">
        <h1 className={state.winner !== null ? "shake" : ""}>
          Super Tic-Tac-Toe!
        </h1>

        <button
          className="button"
          onClick={() =>
            dispatch({
              type: "RESET",
              payload: { mustConfirm: !state.winner },
            })
          }>
          {state.winner ? "Play Again" : "Reset Game"}
        </button>

        {state.winner && (
          <div className="status status-win shake">
            {state.winner === "D" ? "DRAW!!!" : `WINNER: ${state.winner}`}
          </div>
        )}
        {!state.winner && (
          <div className="status">Current player: {state.currentPlayer}</div>
        )}
        {[1, 2, 3].map(i => (
          <div key={i} className="board-row game">
            {[1, 2, 3].map(j => {
              const board = (i - 1) * 3 + (j - 1);

              return (
                <Board
                  key={`super-board-${board}`}
                  dispatch={dispatch}
                  squares={state.squares[board]}
                  boardNumber={board}
                  isPlayable={
                    state.boardToPlay === null || state.boardToPlay === board
                  }
                  lastPlay={state.lastPlay[board]}
                />
              );
            })}
          </div>
        ))}

        <a
          target="_blank"
          href="https://en.wikipedia.org/wiki/Ultimate_tic-tac-toe">
          Rules (Wikipedia)
        </a>
      </div>
    </BoardDispatch.Provider>
  );
}
