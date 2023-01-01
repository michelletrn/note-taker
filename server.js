const express = require('express');
const path = require('path');

const app = express();
const PORT = 3001;

app.listen(PORT, () =>
    console.log(`app listening to http://localhost:${PORT}`)
);


app.use(express.static('public'));

// tells express to display the notes.html when user navigates to /notes by entering it to the url or by clicking the get started button
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html')));