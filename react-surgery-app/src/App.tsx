import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Sass/App.scss";
import Intro from "./Pages/Intro";
import SelectAppointment from "./Pages/SelectAppointment";

function App() {
  return (
    <>
      <img
        src="/images/SurgeryLogo.jpg"
        alt="Surgery Logo"
        style={{
          maxWidth: "200px",
          display: "block",
          margin: "0 auto 1em auto",
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/select-years" element={<SelectAppointment />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
