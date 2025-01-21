Widgets:

Calender

Reminder

Time

Add pane in specific positions

Move panes (or swap panes)

Reward system:

Streak of 50 - Yay (button)

Popup to show due today

Filter panes (and through labels)

Enter custom localstorage

Update popup

Popup to motivate user

Add comments and tips for contributers

Create automation functions

Add animations + Hover Effects

Add tutorial

Background image

Add cookie agreement

Create your own palettes

Format options

Progress for list items

Add labels

Settings

Dashboard

Add some buttons when editing to help format

Add some features in Google Docs (word count, format, maybe all of the insert stuff)

Add PWA features!!!

Update startup screen with themes and update the messages

Add scripts that can be loaded in everytime you open to-doz (plugins)

Add a way to share your to-doz with others

Add a way to swap your panes

In the features part of settings we need:

Scripts you can add

Themes you can add

Features like water break that you can choose to add in the toolbar

"Scriptable" pane that lets you add a script to automate the pane to do get information or something

Fix first toolbar button having overlap with h1

In focus session, start using Date.now() - startTime instead of setInterval (good practices)

Reduce complexity of main.js

Add a way to add a custom background image

Have every original to-doz feature 😎

Automatically open the section you were last on

Make sure to investigate the inputs and make sure they are all secure

Add a template which lets you have divContainers of subjects
chosen by the user and have panes under those subjects

Pane deleted shouldn't run when theres one pane left

Add section button that lets you keep the sidebar open forever

Add scroll down to bottom

Go to section you were last on on startup

Let user give their key to use the tinymce editor

Change manifest.json

Maybe add a way to have To-Doz only load 50 panes at the maximum and load rest when user scrolls to bottom/top

Add a way to have a progress bar for each pane

"Copy" notion (lol)

Compress images if user uploads images (It takes SO Long to load!!!)

- ❗"Stopwatch" time yourself until a certain time (ex: 5:00pm)
- ❗Allow user to add a break every x amount of time
- ❗Allow user to change break amount of time in settings
- ❗Allow user to change focus session to progress bar
- ❗Added option to start from last section
- ❗Security: Don't store sensitive data in local storage, use indexeddb instead
- ❗Add long term and short term panes
- ❗Sub-sections
- ❗Add panes that are automatically added every x amount of

- Low power mode check if device is low power mode or add a setting
to save energy and on low performant devices!

- Consider changing folder strucutre in components (really bad.)

- Add a go to bottom button on ALL pages (because say in the sections.js,
if you have like 20 sections you have to press add section and then go
all the way down)

- No pause indication in the focus session (especialyl in minimized window)

- Unfortunately, if someone manipulates the localstorage through cross-site scripting or can get it or something like that, then that
will let them make requests to their server or take the user's items
To prevent that, either use indexeddb or cookies

Steps:
- make sure to test it with data and configurations preloaded...
- Disable calendar feature in Dashboard.js for now
- Add error handling in the server
- Focus session not notifying on end - because of edge tab efficency or something
try to use web workers to fix that
- Test service workers to work offline
- Comment out password and remove user input
- Make it look nice in Data.js and add notes

Future Update:
- Keep offline data somewhere and upload when data comes back
- Import/Export JSON
- Encrypt database with your password
- Add cloud sign to show if the database is being updated at the moment (similar to repl or google docs)
- Remove Redux - unneccessary for this type of project.
- Add a time tracker for focus sessions (that you can see in the dashboard)
- Address issues tab in microsoft dev tools
- Compress localstorage to save space (and also encrypt it?)
- Key rotations?
- Save spotify token