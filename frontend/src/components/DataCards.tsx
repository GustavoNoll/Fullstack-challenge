import React from 'react';


interface CSVRow {
  [key: string]: string;
}

const DataCard: React.FC<{ rowData: CSVRow }> = ({ rowData }) => {
  return (
    <div className="data-card">
      {Object.entries(rowData).map(([key, value]) => (
        <div className="data-item" key={key}>
          <strong>{key}: </strong>{value}
        </div>
      ))}
    </div>
  );
};

interface CSVData extends Array<CSVRow> {}
const DataCards: React.FC<{ csvData: CSVData }> = ({ csvData }) => {
  return (
    <div className="data-cards break-line">
      {csvData.map((rowData, index) => (
        <DataCard key={index} rowData={rowData} />
      ))}
    </div>
  );
};


export default DataCards;
