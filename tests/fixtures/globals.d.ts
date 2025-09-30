import { expect as ChaiExpect } from "chai";

declare global {
  let expect: typeof ChaiExpect;
}

export {};