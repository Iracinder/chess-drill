const COLOR = {
  red: "#f56a6a",
};

const nthchild = (i: number) =>
  2 * i < 8
    ? `& > :nth-child(16n + ${2 * i + 1})`
    : `& > :nth-child(16n + ${2 * i + 2})`;

type CircleProps = {
  className: string;
  style: any;
  color?: string;
};
function Circle(props: CircleProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={props.className}
      style={props.style}
      fill={props.color}
    >
      <circle cx="50" cy="50" r="10" />
    </svg>
  );
}

function CornerHighlight(props: CircleProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={props.className}
      style={props.style}
      fill={props.color}
    >
      <polygon points="0 0, 20 0, 0 20 " />
      <polygon points="100 0, 80 0, 100 20 " />
      <polygon points="100 100, 80 100, 100 80 " />
      <polygon points="0 100, 0 80, 20 100 " />
    </svg>
  );
}

export { Circle, CornerHighlight, COLOR, nthchild };
