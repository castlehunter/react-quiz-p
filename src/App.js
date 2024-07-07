import { useEffect, useReducer } from "react";
import "./App.css";

function App() {
  useEffect(() => {
    fetch(`http://localhost:8000/questions`)
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => console.log(err));
  }, []);

  function reducer(state, action) {
    switch (action.type) {
      case "start":
        return { ...state, status: "active" };
      case "dataReceived":
        return { ...state, data: action.payload };
      case "correctAnswer":
        return { ...state, points: state.points + action.payload };
      case "disableOptions":
        return { ...state, optionsDisabled: true };
      default:
        throw new Error("Action unknown");
    }
  }

  const initialState = { status: "loading", data: [], index: 0, points: 0 };
  const [{ status, data, index, points, optionsDisabled }, dispatch] =
    useReducer(reducer, initialState);

  return (
    <div className="App">
      <Logo />
      <Score points={points} />
      {status === "loading" && <StartScreen dispatch={dispatch} />}
      {status === "active" && (
        <Question
          question={data[index]}
          dispatch={dispatch}
          optionsDisabled={optionsDisabled}
        />
      )}
    </div>
  );
}

function Logo() {
  return <h1 style={{ textAlign: "center" }}>REACT QUIZ</h1>;
}

function Score({ points }) {
  return (
    <div>
      <span>{points}/280 points</span>
    </div>
  );
}

function StartScreen({ dispatch }) {
  return (
    <div>
      <h2>Welcome</h2>
      <button onClick={() => dispatch({ type: "start" })}>Start</button>
    </div>
  );
}

function Question({ question, dispatch, optionsDisabled }) {
  console.log("Question Object", question);
  const correctIndex = question.correctOption;
  console.log("Correct Index:", correctIndex);
  return (
    <>
      <div>
        <h3>Question: {question.question}</h3>

        <Options
          options={question.options}
          correctIndex={correctIndex}
          dispatch={dispatch}
          points={question.points}
          optionsDisabled={optionsDisabled}
        />
      </div>

      <button className="next-btn">Next</button>
    </>
  );
}

function Options({ options, correctIndex, dispatch, points, optionsDisabled }) {
  function handleClickOption(index) {
    dispatch({ type: "disableOptions" });
    if (index === correctIndex) {
      dispatch({ type: "correctAnswer", payload: points });
    }
  }

  return (
    <div>
      {options.map((op, index) => (
        <button
          key={index}
          onClick={() => handleClickOption(index)}
          disabled={optionsDisabled}
        >
          {op}
        </button>
      ))}
    </div>
  );
}

export default App;
