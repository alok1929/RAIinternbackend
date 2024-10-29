import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const app = express();
app.use(cors());
app.use(express.json());

const DATA_PATH = join(__dirname, 'data', 'data.json');

// Helper function to read data
const readData = () => {
  const data = readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(data);
};

// Helper function to write data
const writeData = (data: any) => {
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
};

// Get all categories and exercises
app.get('/api/categories', (req, res) => {
  try {
    const data = readData();
    console.log("this is categories", data.categories);
    res.json(data.categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get all saved combos
app.get('/api/combos', (req, res) => {
  try {
    const data = readData();
    console.log("this is combos", data.savedCombos);
    res.json(data.savedCombos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch combos' });
  }
});

// Save a new combo
app.post('/api/combos', (req, res) => {
  try {
    const data = readData();
    const newCombo = {
      id: `combo-${Date.now()}`,
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    data.savedCombos.push(newCombo);
    writeData(data);
    console.log(data);
    
    res.status(201).json(newCombo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save combo' });
  }
});



// Update a specific combo
app.put('/api/combos/:id', (req, res) => {
  try {
    const data = readData();
    const comboIndex = data.savedCombos.findIndex((c: any) => c.id === req.params.id);
    
    if (comboIndex === -1) {
      return res.status(404).json({ error: 'Combo not found' });
    }
    
    const updatedCombo = {
      ...data.savedCombos[comboIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    data.savedCombos[comboIndex] = updatedCombo;
    writeData(data);
    
    res.json(updatedCombo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update combo' });
  }
});

// Delete a specific combo
app.delete('/api/combos/:id', (req, res) => {
  try {
    const data = readData();
    const comboIndex = data.savedCombos.findIndex((c: any) => c.id === req.params.id);
    
    if (comboIndex === -1) {
      return res.status(404).json({ error: 'Combo not found' });
    }
    
    data.savedCombos.splice(comboIndex, 1);
    writeData(data);
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete combo' });
  }
});

// Add a new exercise to a category
app.post('/api/categories/:id/exercises', (req, res) => {
  try {
    const data = readData();
    const category = data.categories.find((c: any) => c.id === req.params.id);
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    const newExercise = {
      id: `exercise-${Date.now()}`,
      ...req.body
    };
    
    category.exercises.push(newExercise);
    writeData(data);
    
    res.status(201).json(newExercise);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add exercise' });
  }
});

// Get exercises for a specific category
app.get('/api/categories/:id/exercises', (req, res) => {
  try {
    const data = readData();
    const category = data.categories.find((c: any) => c.id === req.params.id);
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json(category.exercises);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch exercises' });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
