// all possible winning lines for tic-tac-toe
const lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export default function calculateWinner(squares) {
  for (const line of lines) {
    const [a, b, c] = line;
    // win
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], line];
    }
  }

  // draw
  let allSquaresPlayed = true;
  for (const square of squares) {
    if (square === null || square === undefined) {
      allSquaresPlayed = false;
    }
  }
  if (allSquaresPlayed) {
    return ["D", null];
  }

  return [null, null];
}
