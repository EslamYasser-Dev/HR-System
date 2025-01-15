import { useState } from 'react';
import * as XLSX from 'xlsx';

const useSaveAsXLSX = () => {
  const [error, setError] = useState();

  const saveAsXLSX = (jsonData, fileName) => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(jsonData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');
      XLSX.writeFile(workbook, `${fileName}.xlsx`);
      setError(null);
    } catch (err) {
      console.error('Error saving as XLSX:', err);
      setError(err);
    }
  };

  return { saveAsXLSX, error };
};

export default useSaveAsXLSX;
