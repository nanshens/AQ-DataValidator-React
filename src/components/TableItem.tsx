import React, {useState} from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { HolderOutlined, EditOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import {Button, Col, Flex, Row, Input, Popconfirm, Select, InputNumber, Checkbox} from "antd";
import type { PopconfirmProps } from 'antd';
import styles from './tableItem.less';

export function TableItem(props:any) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: props.data.id });

    const [editData, setEditData] = useState(props.data);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: '5px',
        margin: '4px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        backgroundColor: '#fff',
        color: '#000',
        height: '60px',
        cursor: 'pointer',
        lineHeight: "50px",
        ...props.itemStyles,
    };

    const deleteClick = (event:any) => {
        // event.stopPropagation();
        if (props.deleteClick) {
            props.deleteClick(props.data.id);
        }
    }

    const editClick = (event:any) => {
        // event.stopPropagation();
        if (props.editClick) {
            props.editClick(props.data.id);
        }
    }

    const getComp = (column:any) => {
        if (props.filterColumns && column.parentColumn !== undefined) {
            let show = false
            for (const key in props.filterColumns) {
                if (Object.keys(editData).includes(key) && editData[key] !== "") {
                    show = props.filterColumns[key][editData[column.parentColumn]].includes(column.col);
                }
            }
            if (!show) return "";
        }

        if (props.isEditting && (column.disable === undefined || !column.disable)) {
            if (column.type === 'string') {
                return <Input key={props.data.id + column.col} placeholder={column.title} size="small" value={editData[column.col]} onChange={(e) => handleInputChange(e, column.col)}></Input>
            } else if (column.type === 'select') {
                return <Select key={props.data.id + column.col} placeholder={column.title} size="small" value={editData[column.col]} onChange={(e) => handleSelectChange(e, column.col)} options={column.options} />
            } else if (column.type === 'number') {
                return <InputNumber key={props.data.id + column.col} placeholder={column.title} size="small" value={editData[column.col]} onChange={(e) => handleNumberChange(e, column.col)} />
            } else if (column.type === 'boolean') {
                return <Checkbox key={props.data.id + column.col} checked={editData[column.col]} onChange={(e) => handleCheckboxChange(e, column.col)} />
            }
        } else {
            return <div key={props.data.id + column.col}>{editData[column.col]}</div>
        }
    }

    const handleNumberChange = (value:any, column:string) => {
        setEditData({...editData, [column]: value});
    };

    const handleSelectChange = (value:any, column:string) => {
        setEditData({...editData, [column]: value});
    };

    const handleInputChange = (e:any, column:string) => {
        const { value } = e.target;
        setEditData({...editData, [column]: value});
    };

    const handleCheckboxChange = (e:any, column:string) => {
        const { checked } = e.target;
        setEditData({...editData, [column]: checked});
    };

    const cancelItem = () => {
        props.cancelItem()
        setEditData(props.data)
    }

    const saveItem = () => {
        props.saveItem(editData)
    }

    const confirm: PopconfirmProps['onConfirm'] = (e) => {
        props.deleteItem(props.data.id);
    };


    return (
        <div style={style} onClick={props.onClick}>
            <Flex gap="middle" justify={"flex-start"}>
                <Button type="text" size="large" icon={<HolderOutlined />} style={{ cursor: 'move', width: '60px' }} ref={setNodeRef} {...attributes} {...listeners}/>
                <Flex gap="small">
                    {props.columns && (props.columns.map((item:any) => getComp(item)))}
                </Flex>
                <Flex gap="small" style={{width: "100px"}}>
                    {props.isEditting ?
                        <Flex>
                            <Button size="small" type="link" onClick={saveItem}>保存</Button>
                            <Button size="small" type="link" onClick={cancelItem}>取消</Button>
                        </Flex>
                        :
                        <Flex gap="small">
                            <Popconfirm
                                title="是否删除这行数据?"
                                onConfirm={confirm}
                                okText="是"
                                cancelText="否"
                                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                            >
                                <DeleteOutlined className={styles.icon} onClick={deleteClick}/>
                            </Popconfirm>
                            <EditOutlined className={styles.icon} onClick={editClick}/>
                        </Flex>
                    }
                </Flex>
            </Flex>

        </div>
    );
}
