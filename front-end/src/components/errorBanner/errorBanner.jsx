
import { useContext } from "react";
import "./errorBanner.css";
import { ErrorContext } from "../../contexts/errorContext";

export default function ErrorBanner() {
  const { errorMessage, hideError } = useContext(ErrorContext);

  if (!errorMessage) {
    return null;
  }

  return (
    <div className="error-banner">
      <p>{errorMessage}</p>
      <button onClick={() => hideError()}>Hide</button>
    </div>
  );
}