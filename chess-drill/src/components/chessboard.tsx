import { MouseEvent, useState } from "react"
import styled from "styled-components"
import _, { floor, min } from "lodash"
import pieceSVG from "../static/svgs/pieces"
import flipIcon from "../static/svgs/flip_board.svg"
import drillIcon from "../static/svgs/drill.svg"
import StyledSquare from "./square"
import { Circle, COLOR, CornerHighlight, nthchild } from "../utils/theme"
import useWindowDimensions from "../utils/utils"

const FENbeginning =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
/*
const [
    A1, B1, C1, D1, E1, F1, G1, H1,
    A2, B2, C2, D2, E2, F2, G2, H2,
    A3, B3, C3, D3, E3, F3, G3, H3,
    A4, B4, C4, D4, E4, F4, G4, H4,
    A5, B5, C5, D5, E5, F5, G5, H5,
    A6, B6, C6, D6, E6, F6, G6, H6,
    A7, B7, C7, D7, E7, F7, G7, H7,
    A8, B8, C8, D8, E8, F8, G8, H8,
] = _.range(64)
*/

// A1:0, B1: 1... H7:62, H8: 64
const SQUARES = _.range(0, 8)
  .map((c) => _.range(8).map((i) => (7 - c) * 8 + i))
  .flat()

const parseRow = (
  row: string,
  row_number: number,
  highlithed: number[],
  getPossibleMove: (e: MouseEvent, idx: number) => Promise<void>,
  selected?: number
) =>
  [...row]
    .map((c) => (parseInt(c) ? " ".repeat(parseInt(c)) : c))
    .join("")
    .split("")
    .map((c, j) => {
      const i = row_number * 8 + j
      const overlapStyle = {
        gridColumn: "1 / 1",
        gridRow: "1 / 1",
      }
      if (c === " ") {
        return (
          <StyledSquare idx={i} getPossibleMove={getPossibleMove}>
            {highlithed.includes(i) ? (
              <Circle
                className=""
                style={overlapStyle}
                color={COLOR["red"]}
              ></Circle>
            ) : null}
          </StyledSquare>
        )
      } else {
        return (
          <StyledSquare
            idx={i}
            isSelected={selected === i}
            getPossibleMove={getPossibleMove}
          >
            <Piece
              src={(pieceSVG as unknown as { [key: string]: string })[c]}
              alt="piece"
              style={overlapStyle}
            />
            {highlithed.includes(i) ? (
              <CornerHighlight
                className=""
                style={overlapStyle}
                color={COLOR["red"]}
              ></CornerHighlight>
            ) : null}
          </StyledSquare>
        )
      }
    })

const parseBoard = (
  fen: string,
  highlighted: number[],
  getPossibleMove: (e: MouseEvent, idx: number) => Promise<void>,
  selected?: number,
  flipped?: boolean
) => {
  const board = fen
    .split(" ")[0]
    .split("/")
    .map((row, row_number) =>
      parseRow(row, row_number, highlighted, getPossibleMove, selected)
    )
    .flat()
  return flipped ? board.reverse() : board
}

export default function Chessboard({ startFEN }: { startFEN: string }) {
  const [fen, setFen] = useState<string>(startFEN)
  const [highlighted, setHihglighted] = useState<number[]>([])
  const [selected, setSelected] = useState<number>()
  const [flipped, setFlipped] = useState<boolean>(false)
  const [drilling, setDrilling] = useState<boolean>(false)
  const { height, width } = useWindowDimensions()
  const aspectRatioStyle = {
    height: floor(min([height, width])!) * 0.9,
    width: floor(min([height, width])!) * 0.9,
  }
  const getPossibleMove = async (e: MouseEvent, idx: number) => {
    if (idx === selected) {
      setSelected(undefined)
      setHihglighted([])
      return
    }
    if (highlighted.includes(idx)) {
      const origin = SQUARES[selected!]
      const to = SQUARES[idx]
      const newFen = await fetch(
        `http://localhost:8000/move?fen=${fen}&origin=${origin}&to=${to}`
      ).then((value) => {
        return value.json()
      })
      setFen(newFen)
    }
    setSelected(idx)
    const targets: number[] = await fetch(
      `http://localhost:8000/possible_moves/?fen=${fen}&square=${SQUARES[idx]}`
    ).then((value) => {
      return value.json()
    })
    const translatedTargets = targets.map((target) => SQUARES[target])
    setHihglighted(translatedTargets)
  }
  const board = parseBoard(fen, highlighted, getPossibleMove, selected, flipped)
  return (
    <div>
      <ChessB style={aspectRatioStyle}>{board}</ChessB>
      <Icon
        src={flipIcon}
        alt="flipIcon"
        onClick={() => {
          setFlipped(!flipped)
        }}
      />
      <Icon
        src={drillIcon}
        alt="drillIcon"
        onClick={() => {
          setDrilling(!drilling)
          setFen(FENbeginning)
        }}
      />
    </div>
  )
}

const ChessB = styled.div`
  margin: auto;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-auto-rows: 1fr;
  background: #b68963;
  & div {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr;
  }
  ${_.range(8)
    .map((i) => nthchild(i))
    .join()} {
    background: #f1dab7;
  }
`
const Piece = styled.img`
  height: 100%;
  background: inherit;
`

const Icon = styled.img`
  height: 100px;
`
