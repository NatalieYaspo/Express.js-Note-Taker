const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');
const notes = require('./db/db.json');
// const bodyParser = require('body-parser');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

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

app.get('/api/notes', (req, res) => {
  res.json(notes)
});

// POST request to add a Note
app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a Note`);//WORKS
  
    // Destructuring assignment for the items in req.body
    const { title,  text } = req.body;
  
    // If all the required properties are present
    if (title && text) {
      // Variable for the Note object we will save
      const newNote = {
        title,
        text,
        noteId: uuid(),
      };
  
      // Obtain existing Notes
      fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          // Convert string into JSON object
          const parsedNotes = JSON.parse(data);
  
          // Add a new Note
          parsedNotes.push(newNote);
  
          // Write updated Notes back to the file
          fs.writeFile(
            './db/db.json',
            JSON.stringify(parsedNotes, null, 4),
            (writeErr) =>
              writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated Notes!')
          );
        }
      });
  
      const response = {
        status: 'success',
        body: newNote,
      };
  
      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting Note');
    }
  });
  
  app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
  );  