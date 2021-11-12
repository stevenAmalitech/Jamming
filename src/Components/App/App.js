import "./App.css";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import { Component } from "react";
import Spotify from "../../util/Spotify";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: "New Playlist",
      playlistTracks: [],
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  render() {
    return (
      <div>
        <h1>
          Ja<span className="highlight">mmm</span>ing
        </h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTrack}
            />
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    );
  }

  addTrack(track) {
    if (
      !this.state.playlistTracks.some(
        (playlistTrack) => playlistTrack.id === track.id
      )
    ) {
      this.state.playlistTracks.push(track);
      this.setState({ playlistTracks: this.state.playlistTracks });
    }
  }

  removeTrack(track) {
    let newPlaylistTracks = this.state.playlistTracks.filter(
      (playlistTrack) => playlistTrack.id !== track.id
    );
    this.setState({ playlistTracks: newPlaylistTracks });
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  async savePlaylist() {
    try {
      let tracksUri = this.state.playlistTracks.map((track) => track.uri);

      await Spotify.savePlaylist(this.state.playlistName, tracksUri);

      this.setState({
        playlistName: "New Playlist",
        playlistTracks: [],
      });

      alert("Playlist saved to your account");
    } catch (error) {
      console.error(error);
      alert("Error occured. Please refresh page and try again.");
    }
  }

  async search(term) {
    try {
      Spotify.getAccessToken();

      let searchResults = await Spotify.search(term);

      this.setState({ searchResults: searchResults });
    } catch (error) {
      console.error(error);
    }
  }
}
