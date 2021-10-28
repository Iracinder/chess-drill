import React from "react";
import ChessBoard from "./components/chessboard";

const FENdummy =
  "r1bqkb1r/ppp1pp1p/2np1np1/8/3PP1Q1/5N2/PPP2PPP/RNB1KB1R b KQkq - 4 5";

function App() {
  return (
    <div className="App">
      <ChessBoard startFEN={FENdummy}></ChessBoard>
    </div>
  );
}

export default App;
