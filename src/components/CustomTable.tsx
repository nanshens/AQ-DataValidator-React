import React, {useContext, useMemo, useState} from 'react';
import { Button, message, Select } from 'antd';
import {closestCenter, DndContext, DragEndEvent} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import {TableItem} from "@/components/TableItem";


export default function CustomTable(props:any) {

    const onDragEnd = ({ active, over }: DragEndEvent) => {
        if (active.id !== over?.id) {
            if (props.editableId !== '') {
                message.warning('编辑中不允许调整排序');
                return;
            }
            const tableDataSource = props.data;
            const activeIndex = tableDataSource.findIndex((i:any) => i.id === active.id);
            const overIndex = tableDataSource.findIndex((i:any) => i.id === over?.id);
            const dagEndList = arrayMove(tableDataSource, activeIndex, overIndex);
            props.setDataFunc([...dagEndList]);
        }
    };

    // const getRowClassName = (record:any, index:any) => {
    //     return selectedRowKeys.includes(record.id) ? 'ant-table-row-selected' : '';
    // };
    //
    // const onRow = (record:any, rowIndex:any) => ({
    //     onClick: () => {
    //         setSelectedRowKeys([record.id]);
    //     },
    // });

    const getItemStyles = (id:string) => {
        return props.selectedId === id ? { color: "#e30a0a" } : {};
    };

    const click = (id: string) => {
        props.setSelectedFunc(id)
    }

    return (
        <DndContext onDragEnd={onDragEnd} modifiers={[restrictToVerticalAxis]} collisionDetection={closestCenter}>
            <SortableContext items={props.data.map((i:any) => i.id)} strategy={verticalListSortingStrategy}>
                {props.data.map((item:any) => (
                    <TableItem key={item.id} data={item} itemStyles={getItemStyles(item.id)} onClick={() => click(item.id)}/>
                ))}
            </SortableContext>
        </DndContext>
    );
};
