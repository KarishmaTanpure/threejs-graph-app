import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

const ExcelReader = ({ onFileUploaded }) => {
    const [data, setData] = useState([]);
    const [message, setMessage] = useState('');

   
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/uploads/Sample.xlsx'); 
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.arrayBuffer();
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];

                console.log('Sheet:', sheet);
                const jsonData = XLSX.utils.sheet_to_json(sheet);

               
                const formattedData = jsonData.map(row => ({
                    member: row['Member'],
                    startNode: row['Start Node'],
                    endNode: row['End Node']
                })).filter(row => !isNaN(row.startNode) && !isNaN(row.endNode));

                setData(formattedData); 
                onFileUploaded(formattedData); 
                setMessage('Data loaded successfully.');
            } catch (error) {
                console.error('Error fetching data:', error);
                setMessage('Failed to load data.');
            }
        };

        fetchData();
    }, [onFileUploaded]); 

    return (
        <div>
            <p>{message}</p>
            {data.length > 0 && (
                <>
                    <h3>Uploaded Data:</h3>
                    <ul>
                        {data.map((row, index) => (
                            <li key={index}>
                                Member: {row.member}, Start Node: {row.startNode}, End Node: {row.endNode}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default ExcelReader;
