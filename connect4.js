/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7; // Width of the board
const HEIGHT = 6; // Height of the board
let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */
const makeBoard = () => {
  // Using a nested for loop to dynamically generate the array
  for(let h = 0; h < HEIGHT; h++) {
    board.push([]); // Push new row
    for(let w = 0; w < WIDTH; w++) {
      board[h].push(null);  // Push cells into each row
    }
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */
const makeHtmlBoard = () => {
  const htmlBoard = document.querySelector("#board") // Store the board EL

  // Create the top row for the table and an event listener to it
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  // Create the top td elements (cells) and append them to the top row
  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  
  htmlBoard.append(top); // Append the new top row to the htmlBoard


  // Create each new table row for the game spaces
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    // Append cells the current row
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`); // Set id for each cell (indeces)
      row.append(cell);
    }

    htmlBoard.append(row); // Append each new row
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
const findSpotForCol = (x) => {
  // vertical index is between 0 and 5
  // x is the horizontal position
  // I used a reverse for loop to avoid having to check if the entire was empty.
  for (let y = 5; y >=0; y--) {
    // Since we are moving from the bottom up, we return the first null space in that column
    if(board[y][x] === null) {
      return y;
    }
  }
  // If board is full
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */
const placeInTable = (y, x) => {
  // Create the new "piece" Element 
  const piece = document.createElement('div');
  piece.classList.add('piece');
  piece.classList.add(`p${currPlayer}`);
  const spot = document.getElementById(`${y}-${x}`);
  // Append the new piece
  spot.append(piece);
}

/** endGame: announce game end */
const endGame = (msg) => alert(msg);

/** handleClick: handle click of column top to play piece */
const handleClick = (evt) => {
  // Set the value of x to be the id of the clicked column
  const x = +evt.target.id;

  // Get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // Set current space to equal the current player
  board[y][x] = currPlayer;
  // Create and place the piece into the HTML table.
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }
  // check for tie
  if (board.every(row => row.every(cell => cell !== null))) {
    return endGame('Tie!');
  }

  // switch players
  currPlayer = currPlayer === 1 ? currPlayer = 2 : currPlayer = 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */
function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer
    return cells.every(([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      // Creating arrays that would equal a win to check against the logic in the _win function
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }

}

// Initialize the game
makeBoard();
makeHtmlBoard();
