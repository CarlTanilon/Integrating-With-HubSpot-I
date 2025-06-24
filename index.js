require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

const HUBSPOT_BASE_URL = 'https://api.hubapi.com/crm/v3/objects';
const CUSTOM_OBJECT_TYPE = 'p_carl_video_game'; // Replace with your actual custom object type ID
const HUBSPOT_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN;

// Homepage - list custom object records
app.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${HUBSPOT_BASE_URL}/${CUSTOM_OBJECT_TYPE}`, {
      headers: { Authorization: `Bearer ${HUBSPOT_TOKEN}` },
      params: { properties: 'name,powerLevel,bio' }
    });

    const records = response.data.results;
    res.render('homepage', { title: 'Video Game Characters', records });
  } catch (error) {
    console.error('Error fetching records:', error.message);
    res.send('Error fetching records.');
  }
});

// GET route for form
app.get('/update-cobj', (req, res) => {
  res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// POST route to create record
app.post('/update-cobj', async (req, res) => {
  const { name, powerLevel, bio } = req.body;

  try {
    await axios.post(`${HUBSPOT_BASE_URL}/${CUSTOM_OBJECT_TYPE}`, {
      properties: { name, powerLevel, bio }
    }, {
      headers: { Authorization: `Bearer ${HUBSPOT_TOKEN}` }
    });

    res.redirect('/');
  } catch (error) {
    console.error('Error creating record:', error.message);
    res.send('Error creating record.');
  }
});

app.get('/contacts', async (req, res) => {
    const response = await axios.get('https://api.hubapi.com/crm/v3/objects/contacts', {
      headers: {
        Authorization: `Bearer ${HUBSPOT_TOKEN}`
      },
      params: { properties: 'firstname,lastname,email' }
    });
  
    const contacts = response.data.results;
    res.render('contacts', { contacts });
});

app.listen(PORT, () => {
  console.log(`App running on http://localhost:${PORT}`);
});