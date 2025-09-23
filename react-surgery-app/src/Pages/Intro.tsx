import { Link } from "react-router";

const Intro = () => {
  return (
    <>
      <div className="intro">
        <h1>Welcome to the React Surgery App</h1>
        <p>
          This app is designed to help you manage your surgery check-in process
          efficiently.
        </p>
        <p>
          Follow the instructions to get started with your surgery check-in.
        </p>
      </div>
      <div className="button-selection">
        <p>
          <Link to="/select-years" className="btn btn-primary start-button">
            START
          </Link>
        </p>
      </div>
    </>
  );
};

export default Intro;
