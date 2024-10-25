import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx'; // Import XLSX here
import ThreeDGraph from './components/ThreeDGraph';

const App = () => {
    const [graphData, setGraphData] = useState(null); 

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('/uploads/Sample.xlsx'); 
            const data = await response.arrayBuffer();
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet);

            const formattedData = jsonData.map(row => ({
                member: row['Member'],
                startNode: row['Start Node'],
                endNode: row['End Node']
            })).filter(row => !isNaN(row.startNode) && !isNaN(row.endNode));

            setGraphData(formattedData); 
        };

        fetchData();
    }, []);

    return (
        <div>
            {graphData ? (
                <ThreeDGraph data={graphData} />
            ) : (
                <p>Loading...</p> 
            )}
        </div>
    );
};

export default App;
