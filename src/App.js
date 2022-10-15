import { useState, useEffect } from "react";
import "bulma/css/bulma.min.css";
import logo from "./spotifyLogo.png";
import unknown from "./1.jpg";
import axios from "axios";

function App() {
  const CLIENT_ID = "fdbaff3233f24fd2b6c1f1d2db7fc459";
  const REDIRECT_URI = "http://localhost:3000";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";

  const [token, setToken] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];
      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }
    setToken(token);
  }, []);

  const logoutHandler = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  const searchArtists = async (e) => {
    e.preventDefault();
    const { data } = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ` + token,
      },
      params: {
        q: searchKey,
        type: "track",
      },
    });
    console.log(data);
    setArtists(data.tracks.items);
  };

  const searchArtists2 = async (e) => {
    e.preventDefault();
    const { data } = await axios.get("https://api.spotify.com/v1/artists/"+searchKey, {
      headers: {
        Authorization: `Bearer ` + token,
      },
    });
    console.log(data);
    setArtists(data.tracks.items);
  };

  const renderTracks = () => {
    return artists.map((track) => (
      <div className="card" key={track.id}>
        <div className="card-content">
          <div className="media">
            <div className="media-left">
              {track.album.images.length ? (
                <figure className="image is-48x48">
                  <img src={track.album.images[0].url} alt="" />
                </figure>
              ) : (
                <figure className="image is-48x48">
                  <img src={unknown} alt="" />
                </figure>
              )}
            </div>
            <div className="media-content">
              <p className="title is-4">{track.name}</p>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  const renderArtists = () => {
    return artists.map((artist) => (
      <div className="card" key={artist.id}>
        <div className="card-content">
          <div className="media">
            <div className="media-left">
              {artist.images.length ? (
                <figure className="image is-48x48">
                  <img src={artist.images[0].url} alt="" />
                </figure>
              ) : (
                <figure className="image is-48x48">
                  <img src={unknown} alt="" />
                </figure>
              )}
            </div>
            <div className="media-content">
              <p className="title is-4">{artist.name}</p>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div>
      <header>
        <nav
          className="navbar is-success"
          role="navigation"
          aria-label="main navigation"
        >
          <div className="navbar-brand">
            <a href="#" className="navbar-item" >
              <img src={logo} alt="Spotify React" />
              <p style={{color: "white"}} className="navbar-item">Spotify React</p>
            </a>
            <a
              role="button"
              className="navbar-burger"
              aria-label="menu"
              aria-expanded="false"
              data-target="navbarBasicExample"
            >
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>

          <div id="navbarBasicExample" className="navbar-menu">
            <div className="navbar-end">
              <div className="navbar-item">
                <div className="buttons">
                  {!token ? (
                    <a className="button"
                      href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
                    >
                      Login to Spotify
                    </a>
                  ) : (
                    <button className="button" onClick={logoutHandler}>
                      Log Out
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="container mt-6 mb-6">
          {token ? (
            <form className="mt-6 mb-6" onSubmit={searchArtists}>
              <div className="field">
                <label className="label" htmlFor="searchBar">Type a Word</label>
                <input
                  className="input"
                  type="text"
                  name="searchBar"
                  onChange={(e) => setSearchKey(e.target.value)}
                />
              </div>
              <div className="control">
                <button className="button" type="submit">
                  Search
                </button>
              </div>
            </form>
          ) : (
            <h2>Please Log In</h2>
          )}
        </div>
        {renderTracks()}
      </header>
    </div>
  );
}

export default App;
