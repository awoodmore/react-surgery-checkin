export type Appointment = {
  appointmentId: string;
  patientId: string;
  doctorsId: string;
  appointmentTime: string; // Format: "HH:mm"
  patientName: string;
  doctorsName: string;
  patientDateOfBirth: string; /// ISO date string
};
