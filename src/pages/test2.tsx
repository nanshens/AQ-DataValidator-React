import {EditableProTable, ProColumns} from "@ant-design/pro-components";
import React, {useContext, useMemo, useState} from 'react';
import CustomTable from "@/components/CustomTable";


export default () => {
    const [dataSource, setDataSource] = useState<any[]>([]);

    const columns: ProColumns[] = [
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

    return (
        <>
            <CustomTable
                headerTitle="HAPPP"
                columns={columns}
                value={dataSource}
                dataSource={dataSource}
                setDataSource={setDataSource}
            />
        </>
    );
};
