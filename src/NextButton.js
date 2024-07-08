export default function NextButton({ dispatch, index, data }) {
  if (index < data.length - 1) {
    return (
      <button onClick={() => dispatch({ type: "nextQuestion" })}>Next</button>
    );
  }
  if (index === data.length - 1)
    return <button onClick={() => dispatch({ type: "finish" })}>Finish</button>;
}
