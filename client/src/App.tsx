import { useEffect, useState } from "react";
import {
  api, clearSession, errorText, getStoredUser, saveSession, setUnauthorizedHandler,
  type Location, type User,
} from "./api";
import Login from "./Login";
import Board from "./Board";
import "./App.css";

export default function App() {
  const [user, setUser] = useState<User | null>(getStoredUser);
  const [locations, setLocations] = useState<Location[]>([]);
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearSession();
      setUser(null);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    api
      .locations()
      .then((locs) => {
        setLocations(locs);
        setActiveCode((current) => current ?? locs[0]?.code ?? null);
      })
      .catch((err) => setError(errorText(err)));
  }, [user]);

  function handleLogin(token: string, loggedIn: User) {
    saveSession(token, loggedIn);
    setError(null);
    setUser(loggedIn);
  }

  function logout() {
    clearSession();
    setUser(null);
    setLocations([]);
    setActiveCode(null);
  }

  if (!user) return <Login onLogin={handleLogin} />;

  const active = locations.find((l) => l.code === activeCode) ?? null;

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">Rapid Rail · Plotting Board</div>
        <nav className="tabs">
          {locations.map((l) => (
            <button
              key={l.id}
              type="button"
              className={l.code === activeCode ? "tab active" : "tab"}
              onClick={() => setActiveCode(l.code)}
            >
              {l.name}
            </button>
          ))}
        </nav>
        <div className="user">
          {user.username}
          <button type="button" className="link" onClick={logout}>Log out</button>
        </div>
      </header>

      {error && <p className="error page-error" role="alert">{error}</p>}
      {active && <Board key={active.id} location={active} locations={locations} />}
    </div>
  );
}