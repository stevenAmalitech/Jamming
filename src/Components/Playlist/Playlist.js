import { Component } from "react";
import "./Playlist.css";
import TrackList from "../TrackList/TrackList";

export default class Playlist extends Component {
  constructor(props) {
    super(props);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  render() {
    return (
      <div className="Playlist">
        <input
          onChange={this.handleNameChange}
          value={this.props.playlistName}
        />
        <TrackList
          tracks={this.props.playlistTracks}
          isRemoval={true}
          onRemove={this.props.onRemove}
        />
        <button className="Playlist-save" onClick={this.props.onSave}>
          SAVE TO SPOTIFY
        </button>
      </div>
    );
  }

  handleNameChange(e) {
    const value = e.target.value;
    this.props.onNameChange(value);
  }
}
