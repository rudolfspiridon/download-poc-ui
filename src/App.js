import { CSVLink } from "react-csv";
// import Papa from 'papaparse';
import { useCSVDownloader } from 'react-papaparse';
import data1 from './data1';
import data2 from './data2';
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function App() {

  const { CSVDownloader, Type } = useCSVDownloader();
  
  const [tableData, setData] = useState(data2);

  const sortData = () => {
    setData(prevData => [...prevData].sort((a, b) => {
      if (a.queues < b.queues) {
        return -1;
      } else if (a.queues > b.queues) {
        return 1;
      } else {
        return 0;
      }
    }));
  };

  const handleClick = () => {
    console.log('button clicked');
    sortData();
  };

  const rows = [];
  for (let i=0; i<10; i++) {
    rows.push (
      <div key={i}>
        <span>{tableData[i].queues} </span>
        <span>{tableData[i].waiting} </span>
      </div>
    )
  };

  // ######## xlsx
  const generateDownload = () => {

    const ws = XLSX.utils.json_to_sheet(data2);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "People");

    /* convert to binary string */
    const binaryString = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    let length = binaryString.length;
    let buffer = new ArrayBuffer(length);
    let view = new Uint8Array(buffer);

    for(let i=0; i<length; i++) {
        view[i] = binaryString.charCodeAt(i);
    }

    const blob = new Blob([view], {type: 'application/octet-stream'});
    saveAs(blob, 'data.xlsx');
  };

  return (
    <div>
      <CSVDownloader
        type={Type.Button}
        filename={'filename'}
        bom={true}
        config={{
          delimiter: ';',
        }}
        data={tableData}
      >
        Download
      </CSVDownloader>
      <button onClick={generateDownload}>
            Download XLSX
        </button>
      <button onClick={handleClick}>sort</button>
      <div>
        {rows}
      </div>
    </div>

  );
}

export default App;
