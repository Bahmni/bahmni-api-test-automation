export const bahmniUserCredentials = {
    appointmentService: {
        username: process.env.USER_APPOINTMENTSERVICE || "scarlett",
        password: process.env.USER_PASSWORD || "Test@123",
        expected_privileges: ["app:appointments:manageServices"]
    },
    serviceAvailability: {
        username: process.env.USER_SERVICEAVAILABILITY || "georgekirrin",
        password: process.env.USER_PASSWORD || "Test@123",
        expected_privileges: ["app:appointments:manageServiceAvailability"]
    }
};
