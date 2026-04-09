const db = require('../db');

const getCaficultores = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM caficultores ORDER BY nombre ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createCaficultor = async (req, res) => {
  const { nombre, finca, region } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO caficultores (nombre, finca, region) VALUES ($1, $2, $3) RETURNING *',
      [nombre, finca, region]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getCaficultores,
  createCaficultor
};
