import { useEffect, useReducer } from "react";
import "./App.css";
import NextButton from "./NextButton";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";

const SECS_PER_QUESTION = 30;
function reducer(state, action) {
  console.log(action.type); // 添加这一行

  switch (action.type) {
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.data.length * SECS_PER_QUESTION,
      };
    case "dataReceived":
      return { ...state, data: action.payload };
    case "correctAnswer":
      return { ...state, points: state.points + action.payload };
    case "answered":
      return { ...state, optionsDisabled: true };
    case "nextQuestion":
      return { ...state, index: state.index + 1, optionsDisabled: false };
    case "finish":
      return { ...state, status: "finished", optionsDisabled: true };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    default:
      throw new Error("Action unknown");
  }
}

const initialState = {
  status: "loading",
  data: [],
  index: 0,
  points: 0,
  optionsDisabled: false,
  secondsRemaining: null,
};

function App() {
  useEffect(() => {
    fetch(`http://localhost:8000/questions`)
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => console.log(err));
  }, []);

  const [
    { status, data, index, points, optionsDisabled, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  return (
    <div className="App">
      <Logo />
      <Score points={points} data={data} />
      {status === "loading" && <StartScreen dispatch={dispatch} />}
      {status === "active" && (
        <Question
          question={data[index]}
          dispatch={dispatch}
          optionsDisabled={optionsDisabled}
        />
      )}
      <Footer>
        {status === "active" && (
          <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
        )}
        {status === "active" && optionsDisabled && (
          <NextButton dispatch={dispatch} data={data} index={index} />
        )}
      </Footer>
      {status === "finished" && <FinishScreen />}
    </div>
  );
}

function Logo() {
  return <h1 style={{ textAlign: "center" }}>REACT QUIZ</h1>;
}

function Score({ points, data }) {
  const maxPoints = data.reduce((prev, cur) => prev + cur.points, 0);

  return (
    <div>
      <span>
        {points}/{maxPoints} points
      </span>
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
  console.log("QUESTION: ", question);
  return (
    <>
      <div>
        <h3>Question: {question.question}</h3>
        <Options
          question={question}
          dispatch={dispatch}
          optionsDisabled={optionsDisabled}
        />
      </div>
    </>
  );
}

function Options({ dispatch, question, optionsDisabled }) {
  function handleClickOption(index) {
    dispatch({ type: "answered" });
    if (index === question.correctOption) {
      dispatch({ type: "correctAnswer", payload: question.points });
    }
  }

  return (
    <div>
      {question.options.map((op, index) => (
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
