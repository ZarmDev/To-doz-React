import React, { useState, useEffect } from 'react';

// const token = localStorage.getItem("token");
var token = '';

async function fetchWebApi(endpoint, method, body) {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method,
        body: JSON.stringify(body)
    });
    return await res.json();
}

async function createPlaylist(tracksUri) {
    const { id: user_id } = await fetchWebApi('v1/me', 'GET')

    const playlist = await fetchWebApi(
        `v1/users/${user_id}/playlists`, 'POST', {
        "name": "My recommendation playlist",
        "description": "Playlist created by the tutorial on developer.spotify.com",
        "public": false
    })

    await fetchWebApi(
        `v1/playlists/${playlist.id}/tracks?uris=${tracksUri.join(',')}`,
        'POST'
    );

    return playlist;
}

async function getTopTracks(token) {
    // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
    let topTracks = (await fetchWebApi(
        'v1/me/top/tracks?time_range=long_term&limit=5', 'GET'
    )).items;
    topTracks = topTracks.map(track => track.id);
    console.log(topTracks);
    let recommendedTracks = (await fetchWebApi(
        `v1/recommendations?limit=5&seed_tracks=${topTracks.join(',')}`, 'GET'
    )).tracks;
    console.log('rec', recommendedTracks)
    recommendedTracks = recommendedTracks.map(track => track.id);
    const tracksUri = recommendedTracks.map(track => `spotify:track:${track}`);
    console.log(tracksUri);
    const createdPlaylist = await createPlaylist(tracksUri);
    console.log(createdPlaylist.name, createdPlaylist.id);

    return [createdPlaylist, tracksUri];
}

function Dashboard(props) {
    const [elapsed, setElapsed] = useState(`${performance.now()}`);
    const [playlistId, setPlaylistId] = useState("");
    const [tracksUri, setTrackUris] = useState([]);
    const [snapshot_id, setSnapshotId] = useState("");

    const CLIENT_ID = "a62ae9db12064fe9ad9adb7af38e62fe"
    const REDIRECT_URI = "http://localhost:3000/To-doz-React"
    const AUTH_URL = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"

    useEffect(() => {
        // Just to set a interval to update the elapsed time, not to actually change it
        setInterval(() => {
            setElapsed(performance.now())
        }, 1000)
    }, []);

    function exitTool() {
        props.exitTool()
    }

    async function sub(event) {
        event.preventDefault();
        const topTracks = await getTopTracks();
        console.log('created playlist id: ', topTracks[0].id)
        setPlaylistId(topTracks[0].id)
        setSnapshotId(topTracks[0].snapshot_id)
        setTrackUris(topTracks[1])
    }

    async function deleteCurrPlaylist() {
        await fetchWebApi(`v1/playlists/${playlistId}/tracks`, 'DELETE', { "tracks": [{ "uri": tracksUri[0] }], "snapshot_id": snapshot_id})
    }

    function updateToken() {
        token = document.getElementsByName('token')[0].value;
    }

    let totalSeconds = elapsed / 1000;
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
    let seconds = Math.floor(totalSeconds % 60);
    return (
        <div id="dashboard" className='tool'>
            <button className="themedButton exitToolButton" onClick={exitTool}>❌</button>
            <p>Elapsed time since you opened To-doz: {hours} hours, {minutes} minutes and {seconds} seconds</p>
            <h1>Spotify Integration</h1>
            <label htmlFor='token'>Spotify Token (get from https://developer.spotify.com/)</label>
            <input name="token" type="text" onChange={updateToken}></input> <br></br>
            <h2>Options: </h2>
            <label htmlFor='amountofsongs'>Amount of songs</label>
            <input name="amountofsongs" type="text"></input> <br></br>
            <button onClick={sub}>Get recommend songs</button> <br></br>
            <p>Remember to click don't save on spotify (Unless you really like the playlist!)</p>
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
        </div>
    )
}

export default Dashboard;