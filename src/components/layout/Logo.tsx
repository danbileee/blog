interface DefaultProps {
  className: string;
}

export default function Logo({ className }: Partial<DefaultProps>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 467.4 472.72"
      className={className}
    >
      <defs>
        <style>
          {`.cls-1 {fill: #4263eb;}`}
          {`.cls-1,.cls-2 {stroke: #000;stroke-miterlimit: 10;stroke-width: 30px;opacity: 0.85;}`}
          {`.cls-2 {fill: #47f6cb;}`}
        </style>
      </defs>
      <path
        className="cls-1"
        d="M174.11,183.29H15V457.72H174.11C275.27,457.72,358,396,358,320.5h0C358,245,275.27,183.29,174.11,183.29Z"
      />
      <path
        className="cls-2"
        d="M268.47,15H109.36V289.43H268.47c101.16,0,183.93-61.74,183.93-137.21h0C452.4,76.75,369.63,15,268.47,15Z"
      />
    </svg>
  );
}
