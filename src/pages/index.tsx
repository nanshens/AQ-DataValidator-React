import { Scrollbars } from 'react-custom-scrollbars';
import {Button, Card, Col, Input, Layout, List, message, Modal, Row, Typography} from "antd";
import styles from './index.less';
const { Title } = Typography;
import type { SearchProps } from 'antd/es/input/Search';
import {useEffect, useState} from "react";
import {getAllValidator, saveValidator} from "@/services/api";
const { Search } = Input;
import { history } from 'umi';
import { v4 as uuid4 } from 'uuid';
import {AttributeProps, ValidatorProps} from "@/types/validator";
const { Header, Footer, Sider, Content } = Layout;
export default function IndexPage() {
    const [validators, setValidators] = useState([]);
    const [data, setData] = useState([]);
    const [isCreateOpen, setIsCreateOpen] = useState(false);


    const onSearch: SearchProps['onSearch'] = (value, _e, info) =>  {
        const filter_data = validators.filter((v:any) => v.code.includes(value) || v.name.includes(value));
        setData(filter_data)
    }
    useEffect(() => {
        getAllValidator().then((result) => {
            setValidators([]);
            setData([]);
            if (result.code == 200) {
                setValidators(result.data);
                setData(result.data);
            }
        }).catch((error) => {
            setValidators([]);
            setData([]);
        })
    }, []);
    const goConfig = (validator:any) => {
        history.push('/config/' + validator.id)
    }

    const addValidator = () => {
        const validator = {
            id: "NEW-" + uuid4(),
            code: "new-validator",
            name: "new-validator",
            active: true,
            entities: []
        }
        saveValidator(validator).then((result) => {
            if (result.code == 200) {
                message.success("创建成功! 正在跳转...").then(e => {
                    history.push('/config/' + result.data.id)
                })
            }
        }).catch((error) => {
            message.error("创建失败!")
        })

    }

    const createFunc = () => {


    }

    return (
        <Layout className={styles.layoutStyle}>
            <Header className={styles.headerStyle}>
                {/*<Row>*/}
                {/*    <Col span={12}>name</Col>*/}
                {/*    <Col span={12}>buttons</Col>*/}
                {/*</Row>*/}
            </Header>
            <Content className={styles.contentStyle}>
                <div className={styles.main}>
                    <div className={styles.left}>
                        <Search placeholder="input search text" onSearch={onSearch} size="large" allowClear enterButton/>
                        <Scrollbars style={{ height: 'auto' }} className={styles.search_list}>
                            {data.map((item: any) => (
                                <Card onClick={() => goConfig(item)} hoverable style={{ marginBottom: 10 }}>
                                    {item.code} - {item.name}
                                </Card>
                            ))}
                        </Scrollbars>
                    </div>
                    <div className={styles.right}>
                        <Row style={{ position: "absolute", top: '20%', width: '100%' }}>
                            <Col span={24}>
                                <Title>AQ 数据校验系统</Title>
                            </Col>
                            <Col span={24}>
                                <Button type="dashed" size={'large'} onClick={addValidator}>添加校验器</Button>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Content>
            <Modal title="创建校验器" maskClosable={false} closable={false} centered open={isCreateOpen} onOk={createFunc}
                   cancelText={"取消"} okText={"创建"} onCancel={() => setIsCreateOpen(false)}>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Modal>
        </Layout>
    );
}
