import React from "react";

function WelcomeScreen(props) {
    return (
        <div className="fadeInEffect">
                <h1>Welcome to To-Doz-React!</h1>
                <p>What is this project? It's a to-do list application which:
                </p>
                <ol>
                    <li>Is easy to use</li>
                    <li>Similar to to-do applications like notion</li>
                    <li>Is all in your browser (No logging/signing up neccesary)</li>
                </ol> <br></br>
                <p>Why was it made? For convience and because I couldn't find any
                    to-do applications that fit my needs.
                </p>
                <p>Before we start, this website uses <a href="https://www.freecodecamp.org/news/web-storage-localstorage-vs-sessionstorage-in-javascript/" target="_blank">localstorage</a> which is basically
                the equivalent to cookies.
                This localstorage is neccesary for the website to function because
                the site will literally not save your to-do's without it.
                So, by using this site you agree to allow localstorage.
                </p>
                <br></br>
            </div>
    )
}

export default WelcomeScreen;