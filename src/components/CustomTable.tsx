import {EditableProTable, ProColumns} from "@ant-design/pro-components";
import React, {useContext, useMemo, useState} from 'react';
import { HolderOutlined } from '@ant-design/icons';
import { Button, message, Select } from 'antd';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { CSS } from '@dnd-kit/utilities';

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    'data-row-key': string;
}

interface RowContextProps {
    setActivatorNodeRef?: (element: HTMLElement | null) => void;
    listeners?: SyntheticListenerMap;
}

const DragHandle: React.FC = () => {
    const { setActivatorNodeRef, listeners } = useContext(RowContext);
    return (<Button type="text" size="small" icon={<HolderOutlined />} style={{ cursor: 'move' }} ref={setActivatorNodeRef} {...listeners}/>);
};

const RowContext = React.createContext<RowContextProps>({});

const CustomRow: React.FC<RowProps> = (props) => {
    const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
        id: props['data-row-key'],
    });

    const style: React.CSSProperties = {
        ...props.style,
        transform: CSS.Translate.toString(transform),
        transition,
        ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
    };

    const contextValue = useMemo<RowContextProps>(() => ({ setActivatorNodeRef, listeners }), [
        setActivatorNodeRef,
        listeners,
    ]);
    return (
        <RowContext.Provider value={contextValue}>
            <tr {...props} ref={setNodeRef} style={style} {...attributes} />
        </RowContext.Provider>
    );
};

export default function CustomTable(props:any) {
    const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);

    const onDragEnd = ({ active, over }: DragEndEvent) => {
        if (active.id !== over?.id) {
            if (editableKeys.length > 0) {
                message.warning('编辑中不允许调整排序');
                return;
            }
            const tableDataSource = props.dataSource;
            const activeIndex = tableDataSource.findIndex((i:any) => i.id === active.id);
            const overIndex = tableDataSource.findIndex((i:any) => i.id === over?.id);
            const dagEndList = arrayMove(tableDataSource, activeIndex, overIndex);
            props.setDataSource([...dagEndList]);
        }
    };

    const getRowClassName = (record:any, index:any) => {
        return selectedRowKeys.includes(record.id) ? 'ant-table-row-selected' : '';
    };

    const onRow = (record:any, rowIndex:any) => ({
        onClick: () => {
            setSelectedRowKeys([record.id]);
        },
    });

    const dragColumn = {
        key: 'sort',
        dataIndex: 'key',
        editable: false,
        width: 30,
        render: () => <DragHandle />,
    }

    return (
        <>
            <DndContext onDragEnd={onDragEnd} modifiers={[restrictToVerticalAxis]}>
                <SortableContext items={props.dataSource.map((i:any) => i.id)} strategy={verticalListSortingStrategy}>
                    <EditableProTable
                        rowClassName={getRowClassName}
                        onRow={onRow}
                        rowKey="id"
                        headerTitle={props.headerTitle}
                        loading={false}
                        columns={[dragColumn, ...props.columns]}
                        value={props.dataSource}
                        onChange={props.setDataSource}
                        recordCreatorProps={{
                            position: 'bottom',
                            record: () => {
                                return {
                                    id: props.dataSource.length + 1,
                                    objectFieldType: 'description',
                                    cellCount: '1',
                                    isEdit: 'N',
                                    isRequire: 'N',
                                };
                            },}}
                        editable={{
                            type: 'multiple',
                            editableKeys,
                            onSave: async (rowKey, data, row) => {
                                console.log(rowKey, data, row);
                            },
                            onChange: setEditableRowKeys,
                        }}
                        components={{body: {row: CustomRow}}}
                    />
                </SortableContext>
            </DndContext>
        </>
    );
};
