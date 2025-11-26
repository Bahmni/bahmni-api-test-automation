import { environments } from "./environments.js";

function environmentName() {
    let env = process.env.TEST_ENV;
    if (!env) {
        throw new Error (`Test environment has not been specified!!`)
    }
    env = env.trim().toLowerCase();
    if (!environments[env]) {
        throw new Error (`Invalid environment ${env}. Provide a valid environment name: DEV | QA | UAT.`)
    }
    return env;
}

const environment = environmentName();
const envDetails = environments[environment];

export const config = {
    env: environment,
    baseURI: envDetails.baseUri,
    username: process.env.USERNAME,
    password: process.env.PASSWORD
}  
