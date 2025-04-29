const rtf = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
});

export const relativeDate = (epochSeconds: number): string => {
  const now = Date.now();
  const then = epochSeconds * 1000;
  const diffSeconds = Math.round((then - now) / 1000);

  const units = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["week", 60 * 60 * 24 * 7],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
    ["second", 1],
  ] as const;

  for (const [unit, seconds] of units) {
    if (Math.abs(diffSeconds) >= seconds || unit === "second") {
      return rtf.format(
        Math.round(diffSeconds / seconds),
        unit,
      );
    }
  }

  return "now";

}