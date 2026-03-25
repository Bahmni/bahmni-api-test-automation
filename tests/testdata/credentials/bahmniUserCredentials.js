export const bahmniUserCredentials = {
  appointmentAdmin: {
    username: process.env.USER_APPOINTMENTADMIN || "zubair",
    password: process.env.USER_PASSWORD,
    expected_privileges: [
      "app:appointments:manageServices",
      "app:appointments:manageServiceAvailability",
    ],
  },
};
