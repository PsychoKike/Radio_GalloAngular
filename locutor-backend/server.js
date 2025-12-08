import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.use(cors());

const API_KEY = "0481032ecfca462fa538d85b37afd9a1";

app.get('/api/validate-email', async (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.status(400).json({ error: 'Email requerido' });
  }

  try {
    const response = await axios.get(
      "https://api.zerobounce.net/v2/validate",
      {
        params: {
          api_key: API_KEY,
          email
        }
      }
    );

    res.json(response.data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error consultando ZeroBounce' });
  }
});

app.listen(3000, () => {
  console.log("Servidor API corriendo en puerto 3000");
});