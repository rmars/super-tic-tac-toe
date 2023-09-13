import calculateWinner from "../src/app/util";
import "@testing-library/jest-dom";

describe("calculateWinner", () => {
  it("determines a winner and the winning line - empty board", () => {
    const board = [null, null, null, null, null, null, null, null, null];

    const [winner, winLine] = calculateWinner(board);

    expect(winner).toBe(null);
    expect(winLine).toBe(null);
  });

  it("determines a winner and the winning line", () => {
    const boards = [
      {
        board: ["X", "O", null, null, "X", null, "O", "X", "X"],
        winner: "X",
        winLine: [0, 4, 8],
      },
      {
        board: ["X", "X", "X", null, "O", null, "O", "X", "O"],
        winner: "X",
        winLine: [0, 1, 2],
      },
      {
        board: ["O", "X", "X", "O", "O", null, "O", "X", "O"], // fn should return the first winning line
        winner: "O",
        winLine: [0, 3, 6],
      },
      {
        board: [null, "O", null, null, "O", null, null, "O", null],
        winner: "O",
        winLine: [1, 4, 7],
      },
    ];

    for (let i = 0; i < boards.length; i++) {
      let test = boards[i];
      const [winner, winLine] = calculateWinner(test.board);
      expect(winner).toBe(test.winner);
      expect(winLine).toEqual(test.winLine);
    }
  });

  it("determines a draw", () => {
    const board = ["X", "O", "X", "X", "X", "O", "O", "X", "O"];

    const [winner, winLine] = calculateWinner(board);

    expect(winner).toBe("D");
    expect(winLine).toBe(null);
  });
});
