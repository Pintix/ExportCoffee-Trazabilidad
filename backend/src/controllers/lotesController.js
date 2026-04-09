const db = require('../db');

const getLotes = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT l.*, c.nombre as caficultor_nombre, c.finca 
      FROM lotes l 
      JOIN caficultores c ON l.caficultor_id = c.id
      ORDER BY l.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getLoteById = async (req, res) => {
  const { id } = req.params;
  try {
    const lote = await db.query('SELECT * FROM lotes WHERE id = $1', [id]);
    if (lote.rows.length === 0) return res.status(404).json({ error: 'Lote no encontrado' });

    const procesos = await db.query('SELECT * FROM procesos WHERE lote_id = $1 ORDER BY fecha_inicio ASC', [id]);
    const caficultor = await db.query('SELECT * FROM caficultores WHERE id = $1', [lote.rows[0].caficultor_id]);

    res.json({
      ...lote.rows[0],
      caficultor: caficultor.rows[0],
      procesos: procesos.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createLote = async (req, res) => {
  const { caficultor_id, variedad, altura, peso_inicial } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO lotes (caficultor_id, variedad, altura, peso_inicial) VALUES ($1, $2, $3, $4) RETURNING *',
      [caficultor_id, variedad, altura, peso_inicial]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createProceso = async (req, res) => {
  const { lote_id, tipo, sub_tipo, temperatura_promedio, humedad_promedio, notas } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO procesos (lote_id, tipo, sub_tipo, temperatura_promedio, humedad_promedio, notas) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [lote_id, tipo, sub_tipo, temperatura_promedio, humedad_promedio, notas]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getLotes,
  getLoteById,
  createLote,
  createProceso
};
