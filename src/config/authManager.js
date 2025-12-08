import { superAdminCredentials } from "../../tests/testdata/credentials/openmrsCredentials.js";

let basicAuthUser = superAdminCredentials.username;
let basicAuthPassword = superAdminCredentials.password;

export function getAuthCredentials() {
  return {
    authUser: basicAuthUser,
    authPassword: basicAuthPassword,
  };
}

export function setAuthCredentials(username, password) {
  basicAuthUser = username;
  basicAuthPassword = password;
}

export function resetAuthCredentials() {
  basicAuthUser = superAdminCredentials.username;
  basicAuthPassword = superAdminCredentials.password;
}
