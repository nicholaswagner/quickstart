import type { SVGProps } from "react";

export const NW = ({ style, className }: SVGProps<SVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="64"
		height="35"
		viewBox="0,0,64,35"
		fill="currentColor"
		style={style}
		className={className}
	>
		<title>NW</title>
		<path
			fill="currentColor"
			d="M39.724 35 20 0h4.931L42.19 31.5 59.448 0H64L44.276 35h-4.552Z"
		/>
		<path
			fill="currentColor"
			d="M19.724 35 0 0h4.931L22.19 31.5 39.448 0H44L24.276 35h-4.552Z"
		/>
		<path fill="currentColor" d="M20.654 0H25L6.165 35H2" />
	</svg>
);
