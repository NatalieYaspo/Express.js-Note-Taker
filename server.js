const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use(express.static('public'));

//GET request to homepage for app
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

// GET request for Notes
app.get('/notes', (req, res) => {
    // Send a message to the client
    res.status(200).json(`${req.method} request received to get Notes`);
  
    // Log our request to the terminal
    console.info(`${req.method} request received to get Notes`); //Can remove if it works
  });

// POST request to add a Note
app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a Note`);//Can remove if it works
  
    // Destructuring assignment for the items in req.body
    const { title,  text } = req.body;
  
    // If all the required properties are present
    if (title && text) {
      // Variable for the Note object we will save
      const newNote = {
        title,
        text,
      };
  
      // Obtain existing Notes
      fs.readFile('./db/reviews.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          // Convert string into JSON object
          const parsedNotes = JSON.parse(data);
  
          // Add a new Note
          parsedNotes.push(newNote);
  
          // Write updated Notes back to the file
          fs.writeFile(
            './db/reviews.json',
            JSON.stringify(parsedNotes, null, 4),
            (writeErr) =>
              writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated reviews!')
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
      res.status(500).json('Error in posting review');
    }
  });
  
  app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
  );  