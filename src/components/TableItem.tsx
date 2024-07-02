import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { HolderOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {Button, Col, Flex, Row, Input} from "antd";
export function TableItem(props:any) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: props.data.id });

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
                return <Input key={props.data.id + column.col} size="small" value={props.data[column.col]}></Input>
            }
        } else {
            return <div key={props.data.id + column.col}>{props.data[column.col]}</div>
        }
    }

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
                            <Button size="small" type="link" onClick={props.saveItem}>保存</Button>
                            <Button size="small" type="link" onClick={props.cancelItem}>取消</Button>
                        </Flex>
                        :
                        <Flex>
                            <DeleteOutlined onClick={deleteClick}/>
                            <EditOutlined onClick={editClick}/>
                        </Flex>
                    }
                </Flex>
            </Flex>

        </div>
    );
}
