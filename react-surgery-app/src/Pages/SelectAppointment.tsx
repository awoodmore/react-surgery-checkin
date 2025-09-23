import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Appointment } from "../Types/Appointment";

const SelectAppointment = () => {
  const [appointmentData, setAppointmentData] = useState<any[]>([]);
  const [patientData, setPatientData] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctorsData, setDoctorsData] = useState<any[]>([]);
  const [selectedAppointments, setSelectedAppointments] = useState<
    Appointment[]
  >([]);
  const [stage, setStage] = useState<number>(1); // Start at Select Year stage
  const [selectableMonths, setSelectableMonths] = useState<string[]>([]);

  // Optional: Map month numbers to names
  const monthNames: { [key: string]: string } = {
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    "10": "October",
    "11": "November",
    "12": "December",
  };

  useEffect(() => {
    axios
      .get("/db/Appointments.json")
      .then((res: any) => setAppointmentData(res.data))
      .catch((err: any) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get("/db/PatientData.json")
      .then((res: any) => setPatientData(res.data))
      .catch((err: any) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get("/db/DoctorsData.json")
      .then((res: any) => setDoctorsData(res.data))
      .catch((err: any) => console.log(err));
  }, []);

  useEffect(() => {
    if (
      appointmentData.length > 0 &&
      patientData.length > 0 &&
      doctorsData.length > 0
    ) {
      const merged: Appointment[] = appointmentData.map((appt) => {
        const patient = patientData.find((p) => p.id === appt.patientId);
        const doctor = doctorsData.find((d) => d.id === appt.doctorsId);
        return {
          ...appt,
          patientName: patient
            ? `${patient.firstName} ${patient.lastName}`
            : "",
          patientDateOfBirth: patient ? patient.dateOfBirth : "",
          doctorsName: doctor ? doctor.doctorsName : "",
        };
      });
      setAppointments(merged);
    }
  }, [appointmentData, patientData, doctorsData]);

  // Get unique years from patientDateOfBirth in appointments
  const uniqueYears = Array.from(
    new Set(
      appointments
        .map((appt) => appt.patientDateOfBirth?.slice(0, 4))
        .filter((year) => year)
    )
  ).sort();

  // Handler for year button click
  const handleYearClick = (year: string) => {
    const filtered = appointments.filter(
      (appt) =>
        appt.patientDateOfBirth && appt.patientDateOfBirth.startsWith(year)
    );
    setSelectedAppointments(filtered);
    setStage(2); // Move to Select Month stage

    // Create a const selectMonths that has a random selection of 7 months from monthNames but must include the uniqueMonths. The const must contain unique values.
    const allMonthKeys = Object.keys(monthNames);
    // Get unique months from filtered appointments
    const uniqueMonths = Array.from(
      new Set(
        filtered
          .map((appt) => appt.patientDateOfBirth?.slice(5, 7))
          .filter((month) => month)
      )
    );
    let selectMonths = [...uniqueMonths];
    while (selectMonths.length < 7) {
      const randomMonth =
        allMonthKeys[Math.floor(Math.random() * allMonthKeys.length)];
      if (!selectMonths.includes(randomMonth)) {
        selectMonths.push(randomMonth);
      }
    }
    selectMonths = selectMonths.sort();
    setSelectableMonths(selectMonths);
  };

  // Handler for month button click
  const handleMonthClick = (month: string) => {
    const filtered = selectedAppointments.filter(
      (appt) =>
        appt.patientDateOfBirth && appt.patientDateOfBirth.slice(5, 7) === month
    );
    setSelectedAppointments(filtered);
    setStage(3); // Move to next stage
  };

  // Handler for day button click
  const handleDayClick = (day: string) => {
    const filtered = selectedAppointments.filter(
      (appt) =>
        appt.patientDateOfBirth && appt.patientDateOfBirth.slice(8, 10) === day
    );
    setSelectedAppointments(filtered);
    setStage(4); // Move to next stage
  };

  // Handler for time button click
  const handleTimeClick = (time: string) => {
    const filtered = selectedAppointments.filter(
      (appt) => appt.appointmentTime === time
    );
    setSelectedAppointments(filtered);
    setStage(5); // Move to next stage
  };

  return (
    <>
      <h2 className="center">Appointment Check-In</h2>

      {stage == 1 && (
        <>
          <div className="intro">
            <p>
              Please select your birth year from the options below to proceed
              with your appointment check-in.
            </p>
          </div>
          <div>
            {uniqueYears.map((year) => (
              <button
                key={year}
                className="btn btn-secondary m-1"
                onClick={() => handleYearClick(year)}
              >
                {year}
              </button>
            ))}
          </div>
        </>
      )}

      {stage == 2 && (
        <>
          <div className="intro">
            <p>Please select the month you were born</p>
          </div>
          <div>
            {selectableMonths.map((month) => (
              <button
                key={month}
                className="btn btn-secondary m-1"
                onClick={() => handleMonthClick(month)}
              >
                {monthNames[month] || month}
              </button>
            ))}
          </div>
        </>
      )}

      {stage == 3 && (
        <>
          <div className="intro">
            <p>Please select the day you were born.</p>
          </div>
          <div>
            {selectedAppointments.length === 0 ? (
              <div className="no-appointment-found">
                No appointments available with these selections
              </div>
            ) : (
              // Show a list of all day numbers still in the selectedAppointments array,
              // and add a random set of day numbers up to 28 to a maximum of 7
              (() => {
                // Get all unique day numbers from selectedAppointments (as "01", "02", ...)
                let apptDays = Array.from(
                  new Set(
                    selectedAppointments.map((appt) =>
                      appt.patientDateOfBirth
                        ? appt.patientDateOfBirth.slice(8, 10)
                        : null
                    )
                  )
                ).filter(
                  (day): day is string => day !== null && day !== undefined
                );

                // Add random day numbers up to 28, ensuring uniqueness, until we have at most 7 days
                const allPossibleDays = Array.from({ length: 28 }, (_, i) =>
                  (i + 1).toString().padStart(2, "0")
                );
                while (apptDays.length < 7) {
                  const randomDay =
                    allPossibleDays[
                      Math.floor(Math.random() * allPossibleDays.length)
                    ];
                  if (!apptDays.includes(randomDay)) {
                    apptDays.push(randomDay);
                  }
                }
                apptDays = apptDays.sort();

                return (
                  <div>
                    {apptDays.map((day) => (
                      <button
                        key={day}
                        className="btn btn-secondary m-1"
                        onClick={() => handleDayClick(day)}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                );
              })()
            )}
          </div>
        </>
      )}

      {stage == 4 && (
        <>
          <div className="intro">
            <p>Please select the time of your appointment.</p>
          </div>
          <div>
            {selectedAppointments.length === 0 ? (
              <div className="no-appointment-found">
                No appointments available with these selections
              </div>
            ) : (
              // Show a list of 7 times between 8:00AM and 6:00PM that includes the time from the selectedAppointments array
              (() => {
                // Get all appointment times from selectedAppointments
                const apptTimes = selectedAppointments
                  .map((appt) => appt.appointmentTime)
                  .filter(Boolean);

                // Helper to generate a random time between 08:00 and 18:00
                // Helper to generate a random time between 08:00 and 18:00 at 15 minute intervals
                function getRandomTime(existingTimes: string[]): string {
                  const start = 8 * 60; // 8:00 in minutes
                  const end = 18 * 60; // 18:00 in minutes
                  // Generate all possible 15-minute interval times
                  const possibleTimes: string[] = [];
                  for (let minutes = start; minutes <= end; minutes += 15) {
                    const h = Math.floor(minutes / 60)
                      .toString()
                      .padStart(2, "0");
                    const m = (minutes % 60).toString().padStart(2, "0");
                    possibleTimes.push(`${h}:${m}`);
                  }
                  // Filter out existing times
                  const availableTimes = possibleTimes.filter(
                    (t) => !existingTimes.includes(t)
                  );
                  // Pick a random available time
                  if (availableTimes.length === 0) return "";
                  return availableTimes[
                    Math.floor(Math.random() * availableTimes.length)
                  ];
                }

                // Start with unique apptTimes
                let times = Array.from(new Set(apptTimes));
                // Add random times until we have 7, ensuring uniqueness
                while (times.length < 7) {
                  const randomTime = getRandomTime(times);
                  times.push(randomTime);
                }
                // Sort times for display
                times = times.sort();

                return (
                  <div>
                    {times.map((time) => (
                      <button
                        key={time}
                        className="btn btn-secondary m-1"
                        onClick={() => handleTimeClick(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                );
              })()
            )}
          </div>
        </>
      )}

      {stage == 5 && (
        <>
          <div>
            {selectedAppointments.length === 0 ? (
              <div className="no-appointment-found">
                No appointments available with these selections
              </div>
            ) : (
              <div className="appointment-summary">
                <h3 className="center'">Your Appointment:</h3>
                {selectedAppointments.map((appt) => (
                  <ul key={appt.appointmentId}>
                    <li>
                      <strong>Patient:</strong> {appt.patientName}
                    </li>
                    <li>
                      <strong>Date of Birth:</strong> {appt.patientDateOfBirth}
                    </li>
                    <li>
                      <strong>Doctor:</strong> {appt.doctorsName}
                    </li>
                    <li>
                      <strong>Time:</strong> {appt.appointmentTime}
                    </li>
                  </ul>
                ))}
              </div>
            )}
          </div>
          <div className="button-selection">
            <button className="btn btn-primary" onClick={() => setStage(6)}>
              Confirm Check-In
            </button>
          </div>
        </>
      )}

      {stage == 6 && (
        <div className="intro">
          <h3>Check-In Complete</h3>
          <p>
            Thank you for checking in. Please take a seat and the doctor will
            see you shortly.
          </p>
        </div>
      )}

      <div className="button-selection start-over">
        <Link to="/" className="btn btn-primary">
          Start over again
        </Link>
      </div>
    </>
  );
};

export default SelectAppointment;
