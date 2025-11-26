import { authenticatedRequest } from "../../config/apiClient.js";

export const user = {
    getUser: 'openmrs/ws/rest/v1/user'
}

let getUserCustomParams = 'custom:(username,uuid,privileges)';

export async function getUserByUsername(username, customParams) {

    const response = await authenticatedRequest().get(user.getUser)
        .query({
            username: username,
            v: customParams
        }).expect(200);
    
    return response;
}

export async function verifyIfExpectedPrivilegesAreAssigned(username, customParams, expectedPrivileges) {
    const response = await getUserByUsername(username, customParams);
    const mappedPrivileges = response.body.results[0].privileges.map(privilege => privilege.name);
    const privilegeExists = expectedPrivileges.every( 
        expectedPrivilege => mappedPrivileges.includes(expectedPrivilege));
    if (!privilegeExists) {
        const missingPrivileges = expectedPrivileges.filter(
            expectedPrivilege => !mappedPrivileges.includes(expectedPrivilege)
        );
        console.log(`These expected privileges ${missingPrivileges} are not mapped to the user ${username}`);
    }
    return privilegeExists
}
