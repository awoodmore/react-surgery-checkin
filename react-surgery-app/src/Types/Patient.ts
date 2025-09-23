export type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO date string
  gender: string;
  phone: string;
  email: string;
  address: string;
  medicalRecordNumber: string;
  doctorsId: number;
};
