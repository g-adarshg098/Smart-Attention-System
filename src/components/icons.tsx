import type { SVGProps } from "react";

export const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10" />
    <path d="M12 12a5 5 0 0 0 5-5" />
    <path d="M7 12a5 5 0 0 1 5-5" />
  </svg>
);
