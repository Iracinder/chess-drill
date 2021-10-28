import React, { MouseEvent } from "react";
import styled from "styled-components";
import { COLOR } from "../utils/theme";

type SquareProps = {
  className?: string;
  children?: React.ReactNode;
  idx: number;
  isSelected?: boolean;
  getPossibleMove: (e: MouseEvent, idx: number) => Promise<void>;
};

export function Square(props: SquareProps) {
  let className = props.className ?? "";
  if (props.isSelected) {
    className += " selected-piece";
  }
  return (
    <div
      className={className}
      onClick={(e) => {
        props.getPossibleMove(e, props.idx);
      }}
    >
      {props.children}
    </div>
  );
}

const StyledSquare = styled(Square)`
  &.selected-piece {
    background: ${COLOR["red"]} !important;
  }
`;

export default StyledSquare;
