import { filter, isTruthy } from "remeda";

export const compact = filter(isTruthy);
