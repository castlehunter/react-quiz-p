import { useEffect, useReducer } from "react";
import "./App.css";

function App() {
  function reducer(state, action) {
    switch (action.type) {
      case "start":
        return { ...state, status: "active" };
      case "dataReceived":
        return { ...state, data: action.payload };
      default:
        throw new Error("Action unknown");
    }
  }

  const initialState = { status: "loading", data: [] };
  const [{ status, data }, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetch(`http://localhost:8000/questions`)
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="App">
      <Logo />
      {status === "loading" && <StartScreen dispatch={dispatch} />}
      {status === "active" && <Question data={data} />}
    </div>
  );
}

function Logo() {
  return <h1 style={{ textAlign: "center" }}>REACT QUIZ</h1>;
}

function StartScreen({ dispatch }) {
  return (
    <div>
      <h2>Welcome</h2>
      <button onClick={() => dispatch({ type: "start" })}>Start</button>
    </div>
  );
}

function Question({ data }) {
  return <div>{data.map((d) => d.question)}</div>;
}

export default App;
