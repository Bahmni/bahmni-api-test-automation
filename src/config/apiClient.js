import supertest from "supertest";
import { config } from "../config/index.js";
import { getAuthCredentials } from "./authManager.js";

export function authenticatedRequest() {
  const { authUser, authPassword } = getAuthCredentials();
  return supertest.agent(config.baseURI).auth(authUser, authPassword);
}

export function unauthenticatedRequest() {
  return supertest.agent(config.baseURI);
}
