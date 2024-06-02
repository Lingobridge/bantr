import express, { Request, Response } from 'express';
import supabase from './supabaseClient';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Route to get data from Supabase
app.get('/data', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('table-name-1') // Replace with a real table name
      .select('*');

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Route to insert data into Supabase
app.post('/data', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('table-name-2') // Replace with a real table name
      .insert([req.body]);

    if (error) {
      throw error;
    }

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.listen(PORT, () => {
  console.log(`* Server is running on port ${PORT}`);
});
