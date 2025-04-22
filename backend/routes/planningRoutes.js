const express = require('express');
const router = express.Router();
const { getPlanningData } = require('../services/excelService');

router.get('/:month', async (req, res) => {
  try {
    const data = await getPlanningData(req.params.month);
    res.json(data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;