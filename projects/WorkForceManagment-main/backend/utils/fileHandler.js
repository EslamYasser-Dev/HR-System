const fs = require('fs').promises; 

async function writeToJSONFile(data, filename) {
    try {
  
    const jsonData = JSON.stringify(data, null, 2); 
     await fs.writeFile(filename, jsonData, { encoding: 'utf-8' });
      console.log(`Data written to ${filename}`);
    } catch (error) {
      console.error(`Error writing to ${filename}:`, error);
    }
  }

  async function readFromJSONFile(filename) {
    try {  
      const jsonData = await fs.readFile(filename, { encoding: 'utf-8' });
      return JSON.parse(jsonData); 
    } catch (error) {
      console.error(`Error reading from ${filename}:`, error);
      throw error; 
    }
  }

  

  
  export {writeToJSONFile, readFromJSONFile};