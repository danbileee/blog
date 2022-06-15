export const BREAK_POINTS = [768];

export default {
  mobile: `@media (max-width: ${BREAK_POINTS[0]}px)`,
  desktop: `@media (min-width: ${BREAK_POINTS[0]}px)`,
};
