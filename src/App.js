import { BrowserRouter, Route, Switch, Redirect, Link } from "react-router-dom";
// import "./App.css";
import SearchPage from "./pages/SearchPage";
import SearchResults from "./pages/SearchResults";
import DetailsPage from "./pages/DetailsPage";
import FavouritesPage from "./pages/FavouritesPage";
import { createContext, useState } from "react";
import SchedulePage from "./pages/SchedulePage";

export const loggingContext = createContext();

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div className="App">
      <loggingContext.Provider value={[loggedIn, setLoggedIn]}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={SearchPage} />
            <Route path="/results" component={SearchResults} />
            <Route path="/details" component={DetailsPage} />
            <Route path="/favourites" component={FavouritesPage} />
            <Route path="/diet" component={SchedulePage} />
            {/* <Link to="/search?mincarbs=react&maxcarbs=react">Search</Link> */}
            <Redirect to="/" />
          </Switch>
        </BrowserRouter>
      </loggingContext.Provider>
    </div>
  );
}

export default App;
