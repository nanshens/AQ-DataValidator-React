import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { HolderOutlined } from '@ant-design/icons';
import {Button, Col, Flex, Row} from "antd";

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
        padding: '8px',
        margin: '4px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        backgroundColor: '#fff',
        color: '#000',
        height: '60px',
        cursor: 'pointer',
        ...props.itemStyles,
    };

    return (
        <div style={style} onClick={props.onClick}>
            <Flex gap="middle">
                <Button type="text" size="large" icon={<HolderOutlined />} style={{ cursor: 'move', width: '60px' }} ref={setNodeRef} {...attributes} {...listeners}/>
                <Row style={{ height: '50px', lineHeight: "50px"}}>
                    {props.data.code} - {props.data.name}
                </Row>
            </Flex>

        </div>
    );
}
