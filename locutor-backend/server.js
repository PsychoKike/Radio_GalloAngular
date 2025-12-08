import express from 'express';
import axios from 'axios';
import cors from 'cors';

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const KICKBOX_API_KEY = "live_4d50b6cbe746749cf88ad3674072ec83f649c7add5f855f79e7fe70babf51b53";

app.get('/api/validate-email', async (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.status(400).json({ error: 'Missing email parameter' });
  }

  try {
    const response = await axios.get('https://open.kickbox.com/v1/disposable/' + email);
    
    // Kickbox FREE API solo detecta temporal/disposable
    // Si quieres la API COMPLETA usa el endpoint PRO:
    // https://api.kickbox.com/v2/verify?email=EMAIL&apikey=APIKEY

    const result = {
      result: response.data.disposable ? "undeliverable" : "deliverable"
    };

    res.json(result);

  } catch (error) {
    console.error("Kickbox Error:", error.message);
    res.status(500).json({ error: "Error validating email" });
  }
});

app.listen(3000, () => {
  console.log('Kickbox backend running on port 3000');
});