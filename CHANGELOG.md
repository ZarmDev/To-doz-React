- Significantly improved rate-limiting
- Added ability to connect to a database
- Added notifications for when your in offline mode
- Added an alert if you leave without the data being uploaded
- Added new backup screen
- Fixed scrolling down bug in #settingsContent (settings)

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