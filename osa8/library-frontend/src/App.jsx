import { useState, useEffect } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Recommend from "./components/Recommend";
import { useApolloClient } from "@apollo/client/react";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const client = useApolloClient()

  useEffect(() => {
    setErrorMessage(null)
  }, [page])

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()

    if (page === "add") {
      setPage("books")
    }
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>

        {token ? (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("recommend")}>recommend</button>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage("login")}>login</button>
        )}
      </div>
      
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      
      <LoginForm setToken={setToken} setError={setErrorMessage} setPage={setPage} show={page === "login"} />
      <Recommend show={page === "recommend"} />
      <Authors show={page === "authors"} setError={setErrorMessage}/>
      <Books show={page === "books"} setError={setErrorMessage} />
      <NewBook show={page === "add"} setError={setErrorMessage}/>
    </div>
  );
};

export default App;
