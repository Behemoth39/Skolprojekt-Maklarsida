import React, { useState } from "react";

export const ErrorContext = React.createContext(null);

export function ErrorProvider({ children }) {
  const [errorMessage, setErrorMessage] = useState(null);

  function setError(message) {
    setErrorMessage(message);
  }

  function hideError() {
    setErrorMessage(null);
  }

  return (
    <ErrorContext.Provider value={{ errorMessage, setError, hideError }}>
      {children}
    </ErrorContext.Provider>
  );
}

