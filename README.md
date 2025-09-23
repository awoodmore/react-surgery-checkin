i) Open the react-surgery-checkin folder in VSCode

ii) Use Terminal to move to the react-surgery-app folder

iii) in Terminal type:

npm install next

then...

npm run dev

------------------

This sample code simulates a surgery check-in system.

The assumption is that the patient has made a booking for the surgery and has come into the surgery.

They are presented with a system whereby that have to select their date of birth and the time of the booking to check in to see the doctor.

This is similar to a booking system at my local surgery.

The public/db folder contains three JSON files that the application works with as a demonstration. In a real world scenario you would be
pulling this information from an API/database

Appointments.json - contains the appointments for the day
DoctorsData.json - contains the doctors names.
PatientData.json - contains the paitents names.

Therefore to find a booking:

Patient 3: Michael Johnson
Birth Date: 1990-12-01
Booking time: 09:15AM

So if you select Year 1990, Month December, Day 1 and then the 9:15AM time slot you are presented with the booking and can check-in

Another example:

Patient 7: Matthew Miller
Birth Date: 1983-02-25
Booking time: 17:25

So if you select Year 1983, Month February, Day 25 and then the 17:25 time slot you are presented with the booking and can check-in
