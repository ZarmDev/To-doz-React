import React, { useState } from 'react';
import Timer from '../components/Timer.js';

async function fetchWebApi(endpoint, method, body, token) {
  let res = null;
  // if it's get method it CANNOT have a body (error)
  if (method == 'GET') {
    res = await fetch(`https://api.spotify.com/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method
    });
  } else {
    res = await fetch(`https://api.spotify.com/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method,
      body: JSON.stringify(body)
    });
  }
  return await res.json();
}

async function createPlaylist(tracksUri, token) {
  const { id: user_id } = await fetchWebApi('v1/me', 'GET', null, token)

  const playlist = await fetchWebApi(
    `v1/users/${user_id}/playlists`, 'POST', {
    "name": "My recommendation playlist",
    "description": "Playlist created by the tutorial on developer.spotify.com",
    "public": false
  }, token)

  await fetchWebApi(
    `v1/playlists/${playlist.id}/tracks?uris=${tracksUri.join(',')}`,
    'POST', null, token
  );

  return playlist;
}

async function getTopTracks(token) {
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
  let topTracks = (await fetchWebApi(
    'v1/me/top/tracks?time_range=long_term&limit=5', 'GET', null, token
  )).items;
  topTracks = topTracks.map(track => track.id);
  console.log(topTracks);
  let recommendedTracks = (await fetchWebApi(
    `v1/recommendations?limit=5&seed_tracks=${topTracks.join(',')}`, 'GET', null, token
  )).tracks;
  console.log('rec', recommendedTracks)
  recommendedTracks = recommendedTracks.map(track => track.id);
  const tracksUri = recommendedTracks.map(track => `spotify:track:${track}`);
  console.log(tracksUri);
  const createdPlaylist = await createPlaylist(tracksUri, token);
  console.log(createdPlaylist.name, createdPlaylist.id);

  return [createdPlaylist, tracksUri];
}

function FocusSession(props) {
  const [playlistId, setPlaylistId] = useState("");
  const [tracksUri, setTrackUris] = useState([]);
  const [snapshot_id, setSnapshotId] = useState("");
  const [token, setToken] = useState("");
  const [sideBarToggled, setSideBarToggled] = useState(false);

  function toggleSideBar() {
    setSideBarToggled(!sideBarToggled)
  }

  function exitTool() {
    props.exitTool()
  }

  function exitTool() {
    props.exitTool()
  }

  async function sub(event) {
    event.preventDefault();
    const topTracks = await getTopTracks(token);
    // console.log('created playlist id: ', topTracks[0].id)
    setPlaylistId(topTracks[0].id)
    setSnapshotId(topTracks[0].snapshot_id)
    setTrackUris(topTracks[1])
  }

  async function deleteCurrPlaylist() {
    await fetchWebApi(`v1/playlists/${playlistId}/tracks`, 'DELETE', { "tracks": [{ "uri": tracksUri[0] }], "snapshot_id": snapshot_id }, token)
  }

  function updateToken() {
    setToken(document.getElementsByName('token')[0].value);
  }

  function toggleMiniWindow() {
    // maybe use react routes to get it to go to the focus session
    localStorage.setItem('goTo', `focusSession|${window.currentSection}`)
    var w = window.open("https://zarmdev.github.io/To-doz-React/", "", "width=100,height=100");
    const width = window.innerWidth * 0.2;  // x% of the viewport width
    const height = window.innerHeight * 0.45;  // x% of the viewport height
    w.resizeTo(width, height);
  }

  return (
    <div id="focusSession" className={sideBarToggled ? "focusSideBarOn toolNoEffects tool" : "focusSideBarOff toolNoEffects tool"}>
      <button className="themedButton" id="toggleFocusSidebar" onClick={toggleSideBar}>{sideBarToggled ? '<' : ">"}</button>
      <button className="themedButton" id="toggleMiniWindow" onClick={toggleMiniWindow}>{sideBarToggled ? '*' : "*"}</button>
      <button className="themedButton exitToolButton" onClick={exitTool}>❌</button>
      <div id="focusPart">
        <h1 id="focusHeader">Focus Session</h1>
        <Timer></Timer>
      </div>
      <div id="spotifyPart" style={{visibility: sideBarToggled ? "hidden" : "visible", position: sideBarToggled ? "absolute" : ""}}>
        <h1>Spotify Integration</h1>
        <label htmlFor='token'>Spotify Token (get from <a href="https://developer.spotify.com" target='_blank'>https://developer.spotify.com/)</a></label>
        <input name="token" type="text" onChange={updateToken} placeholder='something like BWFJEaKDJkWFI'></input> <br></br>
        <label htmlFor='amountofsongs'>Amount of songs</label>
        <input name="amountofsongs" type="text" placeholder='5'></input> <br></br>
        <button className="themedButton" onClick={sub}>Get recommend songs</button> <br></br>
        <p><b>Remember to click don't save on spotify (Unless you really like the playlist!)</b></p>
        <p>Also, if nothing happens, most likely your token expired, you need to get a new one...</p>
        {/* <button onClick={deleteCurrPlaylist}>Delete Playlist</button> */}
        {playlistId == '' ? <></> :
          <iframe
            title="Spotify Embed: Recommendation Playlist "
            src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`}
            width="100%"
            height="100%"
            style={{ minHeight: '360px' }}
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        }
        <br></br><br></br><br></br>
      </div>
    </div>
  )
}

export default FocusSession;