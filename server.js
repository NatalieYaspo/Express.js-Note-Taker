const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');
const notes = require('./db/db.json');

const {
  readFromFile,
  writeToFile,
  readAndAppend,
} = require('./helpers/fsUtils');

const PORT = process.env.PORT || 3003;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

//GET request to homepage for app
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

// GET request for Notes.html
app.get('/notes', (req, res) => {
  // Sends to notes.html when Get Started is clicked.
  res.sendFile(path.join(__dirname, 'public/notes.html'))
});

//Shows all active notes
app.get('/api/notes', (req, res) => {
  readFromFile('./db/db.json')
    .then(res.json(notes));
});

//GET Route for a specific Note:
app.get('/:note_id', (req, res) => {
  const noteID = req.params.note_id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.note_id === noteID);
      return result.length > 0
        ? res.json(result)
        : res.json('No note with that ID');
    });
});

// POST request to add a Note
app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a Note`);//WORKS

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the Note object we will save
    const newNote = {
      title,
      text,
      note_id: uuid(),
    };

    // Obtain existing Notes
    readAndAppend(newNote, './db/db.json');
    res.json(`Note added successfully`);
  } else {
    res.error('Error in adding note');
  }
});

//DELETE Route for a specific note
app.delete('/api/notes/:note_id', (req, res) => {
  // Log that a DELETE request was received
  console.info(`${req.method} request received to delete a Note`);//It sees this.
  const noteID = req.params.note_id;
  // console.log(req.params.note_id); //Works!
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      //Make a new array of all the notes except the one with the ID provided in the URL
      const result = json.filter((notes) => notes.note_id !== noteID)
      console.log(result);

      //Saves the array to the filesystem
      writeToFile('./db/db.json', result);

      //Logs which note has been deleted
      res.json(`Item ${noteID} has been deleted.`)
    })
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);  