import { authenticatedRequest } from "../../config/apiClient.js";
import { handleApiResponse } from "../../helpers/apiResponseHandler.js";
import { lastApiCall } from "../../helpers/apiTracker.js";
import { config } from "../../config/index.js";

export const user = {
  getUser: "openmrs/ws/rest/v1/user",
};

export async function getUserByUsername(username, customParams) {
  const fullEndpoint = `${config.baseURI}${user.getUser}`;
  const queryParams = {
    username: username,
    v: customParams,
  };

  lastApiCall.method = "GET";
  lastApiCall.endpoint = fullEndpoint;
  lastApiCall.payload = null;
  lastApiCall.queryParams = queryParams;

  return handleApiResponse(
    authenticatedRequest().get(user.getUser).query(queryParams),
    200,
    "GET",
    fullEndpoint,
    null,
    queryParams,
  );
}

export async function verifyIfExpectedPrivilegesAreAssigned(
  username,
  customParams,
  expectedPrivileges,
) {
  const response = await getUserByUsername(username, customParams);
  const mappedPrivileges = response.body.results[0].privileges.map(
    (privilege) => privilege.name,
  );
  const privilegeExists = expectedPrivileges.every((expectedPrivilege) =>
    mappedPrivileges.includes(expectedPrivilege),
  );
  if (!privilegeExists) {
    const missingPrivileges = expectedPrivileges.filter(
      (expectedPrivilege) => !mappedPrivileges.includes(expectedPrivilege),
    );
    console.log(
      `These expected privileges ${missingPrivileges} are not mapped to the user ${username}`,
    );
  }
  return privilegeExists;
}
