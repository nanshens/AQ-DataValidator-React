import React, {useState} from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { HolderOutlined, EditOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import {Button, Col, Flex, Row, Input, Popconfirm} from "antd";
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
        if (props.isEditting) {
            if (column.type === 'string') {
                return <Input key={props.data.id + column.col} size="small" value={editData[column.col]} onChange={(e) => handleInputChange(e, column.col)}></Input>
            }
        } else {
            return <div key={props.data.id + column.col}>{editData[column.col]}</div>
        }
    }

    const handleInputChange = (e:any, column:string) => {
        const { value } = e.target;
        setEditData({...editData, [column]: value});
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
                <Flex gap="middle" style={{width: "100%"}}>
                    {props.columns && (props.columns.map((item:any) => getComp(item)))}
                </Flex>
                <Flex gap="middle" style={{width: "100px"}}>
                    {props.isEditting ?
                        <Flex>
                            <Button size="small" type="link" onClick={saveItem}>保存</Button>
                            <Button size="small" type="link" onClick={cancelItem}>取消</Button>
                        </Flex>
                        :
                        <Flex gap="middle">
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
