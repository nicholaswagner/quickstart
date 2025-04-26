import { Link } from "@radix-ui/themes";
import { useLocation } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import type { ComponentProps } from "react";
import styles from "./breadcrumbs.module.css";

const CrumbPage = ({
	key,
	label,
}: ComponentProps<"li"> & { label: string; href?: string }) => {
	return (
		<Link
			key={key}
			size="1"
			weight="bold"
			color="gray"
			aria-disabled="true"
			aria-current="page"
			tabIndex={0}
			style={{ color: "var(--gray-11)", userSelect: "none" }}
		>
			{label}
		</Link>
	);
};

const CrumSeparator = ({
	children,
	className,
	...props
}: ComponentProps<"li">) => {
	return (
		<li
			data-slot="breadcrumb-separator"
			role="presentation"
			aria-hidden="true"
			className={className}
			style={{ color: "var(--gray-10)" }}
			{...props}
		>
			{children || <ChevronRight style={{ scale: 0.5 }} />}
		</li>
	);
};

export const BreadCrumbs = () => {
	const { pathname } = useLocation();
	const paths = pathname === "/" ? ["index"] : pathname.split("/");
	const numPaths = paths.length;
	const crumbs = paths.map((path, index) => {
		const isLastItem = index === numPaths - 1;
		const href = pathname.slice(0, pathname.indexOf(path) + path.length);
		const crumb = (
			<Link
				key={`${href}`}
				href={href}
				size="1"
				weight="bold"
				className="rootlink" //{styles.link}
			>
				{path}
			</Link>
		);

		return (
			<>
				<li
					key={`breadcrumb-${path}`}
					data-slot={isLastItem ? "breadcrumb-page" : "breadcrum-item"}
				>
					{!isLastItem && crumb}
					{isLastItem && <CrumbPage key={`crumb-page-${path}`} label={path} />}
				</li>
				{index > 0 && index < numPaths - 1 && <CrumSeparator key={`${path}`} />}
			</>
		);
	});

	return (
		<nav
			aria-label="breadcrumbs"
			data-slot="breadcrumbs"
			className={styles.breadcrumbs}
		>
			<ol data-slot="breadcrumb-list">{crumbs}</ol>
		</nav>
	);
};
