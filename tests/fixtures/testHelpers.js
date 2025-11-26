import { verifyIfExpectedPrivilegesAreAssigned } from '../../src/services/openmrs/user.js';

export async function checkPrivilegesOrSkip(context, username, customParams, expectedPrivileges) {
    const hasPrivileges = await verifyIfExpectedPrivilegesAreAssigned(
        username,
        customParams,
        expectedPrivileges
    );
    
    if (!hasPrivileges) {
        const message = `[TEST SKIPPED - User '${username}' missing privileges: ${expectedPrivileges}]`;
        console.log(`Skipping test: ${context.test.title} - ${message}`);
        context.test.title += ` ${message}`;
        context.skip();
    }
}
