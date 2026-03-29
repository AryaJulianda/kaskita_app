import type { persist as PersistType } from "zustand/middleware";

const middleware = require("zustand/middleware") as {
  persist: typeof PersistType;
};

export const persist = middleware.persist;
