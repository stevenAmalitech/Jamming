let accessToken = "";
const redirectUrl = "http://localhost:3000/";
const clientId = "cc41fad81b544bafa50e3bfb1c795aff";

const spotify = {
  getAccessToken() {
    if (accessToken) return accessToken;

    let accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    let expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
      window.history.pushState("Access Token", null, "/");

      return accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUrl}`;
      window.location = accessUrl;
    }
  },

  async search(searchTerm) {
    try {
      const url = `https://api.spotify.com/v1/search?type=track&q=${searchTerm}`;
      const headers = { Authorization: `Bearer ${accessToken}` };

      const response = await fetch(url, { headers });

      if (!response.ok) throw response;

      const result = await response.json();

      return result.tracks.items.map((track) => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri,
      }));
    } catch (error) {
      console.error(error);
    }
  },

  async savePlaylist(playlistName, tracksUri) {
    try {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      };

      const userResponse = await fetch("https://api.spotify.com/v1/me", {
        headers,
      });

      if (!userResponse.ok) throw Error("User Id fetch");

      const userData = await userResponse.json();
      const userId = userData.id;

      const playlistResponse = await fetch(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ name: playlistName }),
        }
      );

      if (!playlistResponse.ok) throw Error("Playlist post error");

      const playlistData = await playlistResponse.json();
      const playlistId = playlistData.id;

      fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: "POST",
        headers,
        body: JSON.stringify({ uris: tracksUri }),
      }).catch((error) => {
        throw Error(error);
      });
    } catch (error) {
      console.error(error);
    }
  },
};

export default spotify;
