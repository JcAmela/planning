const xlsx = require('xlsx');
const path = require('path');

function getPlanningData(month) {
  const filePath = path.join(__dirname, '../../planning.xlsx');
  const workbook = xlsx.readFile(filePath);

  if (!workbook.Sheets[month]) {
    throw new Error(`La hoja "${month}" no existe en el Excel.`);
  }

  const sheet = workbook.Sheets[month];
  const rawData = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  const activities = [];
  let currentDay = null;
  for (let i = 2; i < rawData.length; i++) {
    const row = rawData[i];
    if (!row || row.length < 4) continue;

    if (!isNaN(row[0])) {
      currentDay = {
        Data: row[0],
        DiaSetmana: row[1] || '',
      };
    }

    if (row[2] || row[3]) {
      activities.push({
        Dia: currentDay ? `${currentDay.DiaSetmana} ${currentDay.Data}` : '',
        Hora: row[2] || '',
        Activitat: row[3] || '',
        Organitza: row[4] || '',
        Responsable: row[5] || '',
        Telefon: row[6] || '',
        Espai: row[7] || '',
        Observacions: row[8] || ''
      });
    }
  }

  return activities;
}

module.exports = { getPlanningData };