import React, { useState } from 'react';
import { Input, Button } from 'antd';

const TableItem = ({ rowData, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(rowData);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        onSave(editData);
        setIsEditing(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <tr>
            {isEditing ? (
                <>
                    <td><Input name="name" value={editData.name} onChange={handleInputChange} /></td>
                    <td><Input name="age" value={editData.age} onChange={handleInputChange} /></td>
                    <td>
                        <Button type="primary" onClick={handleSaveClick}>保存</Button>
                    </td>
                </>
            ) : (
                <>
                    <td>{rowData.name}</td>
                    <td>{rowData.age}</td>
                    <td>
                        <Button type="primary" onClick={handleEditClick}>编辑</Button>
                    </td>
                </>
            )}
        </tr>
    );
};

export default TableItem;
