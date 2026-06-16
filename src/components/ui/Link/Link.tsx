import { Link as RadixLink } from "@radix-ui/themes";
import { type LinkComponent, createLink } from "@tanstack/react-router";
import * as React from "react";

// Radix Themes' <Link> (its full prop set — color, size, weight, underline, plus
// anchor attributes). TanStack Router will inject the routing props (href, onClick,
// preload handlers) on top via createLink.
type RadixLinkProps = React.ComponentPropsWithoutRef<typeof RadixLink>;

const RadixLinkForwardRef = React.forwardRef<HTMLAnchorElement, RadixLinkProps>(
	(props, ref) => <RadixLink ref={ref} {...props} />,
);
RadixLinkForwardRef.displayName = "RadixLinkForwardRef";

const CreatedLink = createLink(RadixLinkForwardRef);

/**
 * App-wide link: Radix Themes styling fused with TanStack Router navigation —
 * typed `to`/`params`/`search`, active-state props, and intent-based preloading.
 *
 * Use this for *internal* navigation, e.g. `<Link to="/query">`. For external or
 * raw `href` links, use the plain `<Link>` from `@radix-ui/themes` instead.
 *
 * Pattern per https://tanstack.com/router/latest/docs/guide/custom-link
 */
export const Link: LinkComponent<typeof RadixLinkForwardRef> = (props) => {
	return <CreatedLink preload="intent" {...props} />;
};
