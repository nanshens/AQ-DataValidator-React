import React, { useState } from 'react';
import TableItem from "@/pages/test3";

const Table = ({ data }) => {
    const [tableData, setTableData] = useState(data);

    const handleSave = (index, newRowData) => {
        const newData = [...tableData];
        newData[index] = newRowData;
        setTableData(newData);
    };

    return (
        <table>
            <thead>
            <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Action</th>
            </tr>
            </thead>
            <tbody>
            {tableData.map((row, index) => (
                <TableItem
                    key={index}
                    rowData={row}
                    onSave={(newRowData) => handleSave(index, newRowData)}
                />
            ))}
            </tbody>
        </table>
    );
};

export default Table;
