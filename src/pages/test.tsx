import {EditableProTable, ProColumns} from "@ant-design/pro-components";
import React, {useContext, useMemo, useState} from 'react';
import { HolderOutlined } from '@ant-design/icons';
import { Button, notification, Drawer, Tag, Popconfirm, message, Divider, Form, Space, Spin, Select } from 'antd';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { CSS } from '@dnd-kit/utilities';


type DataSourceType = {
    id: React.Key;
    title?: string;
    readonly?: string;
    decs?: string;
    state?: string;
    created_at?: number;
    update_at?: number;
    children?: DataSourceType[];
};

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    'data-row-key': string;
}

interface RowContextProps {
    setActivatorNodeRef?: (element: HTMLElement | null) => void;
    listeners?: SyntheticListenerMap;
}

const DragHandle: React.FC = () => {
    const { setActivatorNodeRef, listeners } = useContext(RowContext);
    return (
        <Button
            type="text"
            size="small"
            icon={<HolderOutlined />}
            style={{ cursor: 'move' }}
            ref={setActivatorNodeRef}
            {...listeners}
        />
    );
};

const RowContext = React.createContext<RowContextProps>({});

const CusRow: React.FC<RowProps> = (props) => {
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

export default () => {
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
    const [dataSource, setDataSource] = useState<readonly DataSourceType[]>([]);
    const [columnNames, setColumnNames] = useState<any[]>([{label:'test',value:'test'}]);
    const [tableName, setTableName] = useState<string>('');

    const FormColumns: ProColumns[] = [
        {
            key: 'sort',
            dataIndex: 'key',
            editable: false,
            width: 30,
            render: () => <DragHandle />,
        },
        {
            title: '列名',
            dataIndex: 'columnName',
            key: 'columnName',
            valueType: 'select',
            renderFormItem: (_, config, formInstance) => (
                <Select
                    options={columnNames}
                    onChange={(event: any) => {
                        let temp = dataSource;
                        for (let item of temp) {
                            if (item.id == config.record.id) {
                                item.columnName = event;
                                // item.objectFieldName = underlineToHump(event);
                                break;
                            }
                        }
                        setDataSource(temp);
                    }}
                />
            ),
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: '此项为必填项',
                    },
                ],
            },
        },
        {
            title: '字段名',
            dataIndex: 'objectFieldName',
            key: 'objectFieldName',
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: '此项为必填项',
                    },
                ],
            },
        },
        {
            title: 'Label名',
            dataIndex: 'labelName',
            key: 'labelName',
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: '此项为必填项',
                    },
                ],
            },
        },
        {
            title: '组件类别',
            dataIndex: 'objectFieldType',
            key: 'objectFieldType',
            valueType: 'select',
            valueEnum: {
                select: {
                    text: 'Select',
                },
                input: {
                    text: 'Input',
                },
                description: {
                    text: 'Description',
                },
            },
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: '此项为必填项',
                    },
                ],
            },
        },
        {
            title: '超链接',
            dataIndex: 'linkUrl',
            key: 'linkUrl',
        },
        {
            title: 'Cell数量',
            dataIndex: 'cellCount',
            key: 'cellCount',
            valueType: 'select',
            width: 100,
            valueEnum: {
                '1': {
                    text: '1',
                },
                '2': {
                    text: '2',
                },
                '3': {
                    text: '3',
                },
            },
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: '此项为必填项',
                    },
                ],
            },
        },
        {
            title: '编辑',
            dataIndex: 'isEdit',
            key: 'isEdit',
            valueType: 'select',
            width: 100,
            valueEnum: {
                Y: {
                    text: 'True',
                },
                N: {
                    text: 'False',
                },
            },
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: '此项为必填项',
                    },
                ],
            },
        },
        {
            title: '必填',
            dataIndex: 'isRequire',
            key: 'isRequire',
            valueType: 'select',
            width: 100,
            valueEnum: {
                Y: {
                    text: 'True',
                },
                N: {
                    text: 'False',
                },
            },
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: '此项为必填项',
                    },
                ],
            },
        },
        {
            title: '操作',
            valueType: 'option',
            width: 200,
            render: (text, record, _, action) => [
                <a
                    key="editable"
                    onClick={() => {
                        action?.startEditable?.(record.id);
                    }}
                >
                    编辑
                </a>,
                <a
                    key="delete"
                    onClick={() => {
                        setDataSource(dataSource.filter((item) => item.id !== record.id));
                    }}
                >
                    删除
                </a>,
            ],
        },
    ];

    const onDragEnd = ({ active, over }: DragEndEvent) => {
        if (active.id !== over?.id) {
            if (editableKeys.length > 0) {
                message.warning('编辑中不允许调整排序');
                return;
            }
            const tableDataSource = dataSource;
            const activeIndex = tableDataSource.findIndex((i) => i.id === active.id);
            const overIndex = tableDataSource.findIndex((i) => i.id === over?.id);
            const dagEndList = arrayMove(tableDataSource, activeIndex, overIndex);
            setDataSource([...dagEndList]);
        }
    };

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);


    const getRowClassName = (record, index) => {
        return selectedRowKeys.includes(record.objectFieldName) ? 'ant-table-row-selected' : '';
    };

    const onRow = (record, rowIndex) => ({
        onClick: () => {
            setSelectedRowKeys([record.objectFieldName]);
        },
    });

    return (
        <>
            <DndContext onDragEnd={onDragEnd} modifiers={[restrictToVerticalAxis]}>
                <SortableContext items={dataSource.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                    <EditableProTable
                        rowClassName={getRowClassName}
                        onRow={onRow}
                        rowKey="id"
                        headerTitle="可编辑表格"
                        maxLength={5}
                        scroll={{
                            x: 960,
                        }}
                        recordCreatorProps={{
                            position: 'bottom',
                            record: () => {
                                return {
                                    id: dataSource.length + 1,
                                    objectFieldType: 'description',
                                    cellCount: '1',
                                    isEdit: 'N',
                                    isRequire: 'N',
                                };
                            },}}
                        loading={false}
                        columns={FormColumns}
                        value={dataSource}
                        onChange={setDataSource}
                        editable={{
                            type: 'multiple',
                            editableKeys,
                            onSave: async (rowKey, data, row) => {
                                console.log(rowKey, data, row);
                            },
                            onChange: setEditableRowKeys,
                        }}
                        components={{body: {row: CusRow}}}
                    />
                </SortableContext>
            </DndContext>
        </>
    );
};
