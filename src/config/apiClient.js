import supertest from "supertest";
import { config } from "../config/index.js";

export function request() {
    return supertest(config.baseURI);
}
