import {Button, Col, Layout, message, Row} from "antd";
const { Header, Footer, Sider, Content } = Layout;
import styles from './config.less';
import {useParams} from "react-router";
import {useEffect, useState} from "react";
import {getAllValidator, getValidatorInfo} from "@/services/api";
import {DragSortTable, ProColumns} from "@ant-design/pro-components";

const columns: ProColumns[] = [
    {
        dataIndex: 'sort',
        width: 60,
        className: 'drag-visible',
    },
    {
        dataIndex: 'code',
        className: 'drag-visible',
    },
    {
        dataIndex: 'name',
        className: 'drag-visible',
    },
    {
        title: '操作',
        valueType: 'option',
        render: (text, record, _, action) => [
            <a key="editable" onClick={() => {action?.startEditable?.(record.id);}}>
                编辑
            </a>,
            <a key="delete" onClick={() => {action?.startEditable?.(record.id);}}>
                删除
            </a>,
        ],
    }
];

const data = [
    {
        key: '1',
        name: 'John Brown',
        code: 32,
        address: 'New York No. 1 Lake Park',
    },
    {
        key: '2',
        name: 'Jim Green',
        code: 42,
        address: 'London No. 1 Lake Park',
    },
    {
        key: '3',
        name: 'Joe Black',
        code: 32,
        address: 'Sidney No. 1 Lake Park',
    },
];

export default function ConfigPage() {
    const urlParams  = useParams();
    const [validator, setValidator] = useState({
        id: "",code: "",name: "",config: []
    });
    const [dataSource, setDataSource] = useState(data);

    const handleDragSortEnd = (
        beforeIndex: number,
        afterIndex: number,
        newDataSource: any,
    ) => {
        console.log('排序后的数据', newDataSource);
        setDataSource(newDataSource);
        message.success('修改列表排序成功');
    };

    useEffect(() => {
        getValidatorInfo(String(urlParams.id)).then((result) => {
            setValidator({id: "",code: "",name: "",config: []});
            if (result.code == 200) {
                setValidator(result.data);
            }
        }).catch((error) => {
            setValidator({id: "",code: "",name: "",config: []});
        })
    }, []);

    return (
    <div>
        <Layout className={styles.layoutStyle}>
            <Header className={styles.headerStyle}>
                <Row>
                    <Col span={6}>AQ-数据校验系统</Col>
                    <Col span={6}>{validator.code} - {validator.name}</Col>
                    <Col span={12}>
                        <Button>主页</Button>
                        <Button>执行</Button>
                        <Button>复制配置</Button>
                        <Button>设置</Button>
                        <Button>历史</Button>
                    </Col>
                </Row>
            </Header>
            <Content className={styles.contentStyle}>
                <Row className={styles.fullHeight}>
                    <Col span={6} className={styles.fullHeight}>
                        <Button>新加一行</Button>
                        <Button>导入</Button>
                        <DragSortTable
                            columns={columns}
                            rowKey="key"
                            search={false}
                            pagination={false}
                            dataSource={dataSource}
                            dragSortKey="sort"
                            onDragSortEnd={handleDragSortEnd}
                            showHeader={false}
                            options={false}
                        />
                    </Col>
                    <Col span={6}>attribute</Col>
                    <Col span={12}>
                        <Row>
                            <Col span={24}>
                                validation rule
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                repair rule
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                buttons
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Content>
        </Layout>
    </div>
  );
};
