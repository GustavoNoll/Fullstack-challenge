import React, { useState } from 'react';
import axios from 'axios';
import FileUploader from './components/FileUploader';
import SearchBar from './components/SearchBar';
import DataCards from './components/DataCards';
import config from './config'


interface CSVRow {
  [key: string]: string;
}
interface CSVData extends Array<CSVRow> {}


const App: React.FC = () => {
  const [csvData, setCsvData] = useState<CSVData>([]);

  const fetchData = async (query: string) => {
    try {
      const response = await axios.get(`${config.backendUrl}${config.endpoints.users}`, {
        params: {
          q: query
        }
      });
      console.log('Search Results:', response.data["data"]);
      setCsvData(response.data["data"]);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleSearchQueryChange = (query: string) => {
    fetchData(query); // Fetch data again when search query changes
  };

  const handleUploadSuccess = () => {
    fetchData(''); 
  };

  return (
    <div className='container'>
      <h1>CSV Data Viewer</h1>
      <FileUploader onUploadSuccess={handleUploadSuccess}/>
      <SearchBar onSearchQueryChange={handleSearchQueryChange} />
      <p>There are {csvData.length} rows</p>
      <DataCards csvData={csvData} />
    </div>
  );
};

export default App;
