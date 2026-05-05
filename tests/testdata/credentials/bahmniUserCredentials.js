export const bahmniUserCredentials = {
  appointmentAdmin: {
    username: process.env.USER_APPOINTMENTADMIN || "zubair_appadmin",
    password: process.env.USER_PASSWORD,
    role: "Appointment Admin",
    expected_privileges: [
      "app:appointments:manageServices",
      "app:appointments:manageServiceAvailability",
    ],
  },
  frontDesk: {
    username: process.env.USER_FRONTDESK || "zuri_frontdesk",
    password: process.env.USER_PASSWORD,
    role: "FrontDesk",
  },
  receptionist: {
    username: process.env.USER_RECEPTIONIST || "judy_receptionist",
    password: process.env.USER_PASSWORD,
    role: "Receptionist",
  },
  registration: {
    username: process.env.USER_REGISTRATION || "nafula_registration",
    password: process.env.USER_PASSWORD,
    role: "Registration",
  },
  doctor: {
    username: process.env.USER_DOCTOR || "omar_doctor",
    password: process.env.USER_PASSWORD,
    role: "Doctor"
  },
  radiologyTechnician: {
    username: process.env.USER_RADTECH || "odinga_radtech",
    password: process.env.USER_PASSWORD,
    role: "Radiology Technician",
  },
  radiologist: {
    username: process.env.USER_RADIOLOGIST || "bakole_radiologist",
    password: process.env.USER_PASSWORD,
    role: "Radiologist",
  },
};
