export const bahmniUserCredentials = {
  appointmentAdmin: {
    username: process.env.USER_APPOINTMENTADMIN || "zubair_appadmin",
    password: process.env.USER_PASSWORD,
    expected_privileges: [
      "app:appointments:manageServices",
      "app:appointments:manageServiceAvailability",
    ],
  },
};
