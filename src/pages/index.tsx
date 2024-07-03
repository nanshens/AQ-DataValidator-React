import yayJpg from '../assets/yay.jpg';
import {Button, Col, Input, Layout, List, Row, Typography} from "antd";
import styles from './index.less';
const { Title } = Typography;
import type { SearchProps } from 'antd/es/input/Search';
import {useEffect, useState} from "react";
import {getAllValidator} from "@/services/api";
const { Search } = Input;
import { history } from 'umi';
const { Header, Footer, Sider, Content } = Layout;
export default function IndexPage() {
    const [validators, setValidators] = useState([]);
    const [data, setData] = useState([]);

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
    const go_config = (validator:any) => {
        history.push('/config/' + validator.id)
    }

    return (
        <Layout className={styles.layoutStyle}>
            <Header className={styles.headerStyle}>
                <Row>
                    <Col span={12}>name</Col>
                    <Col span={12}>buttons</Col>
                </Row>
            </Header>
            <Content className={styles.contentStyle}>
                <Row >
                    <Col offset={2} span={8} className={styles.left}>
                        <Search placeholder="input search text" onSearch={onSearch} size="large" allowClear enterButton />
                        <List
                            bordered
                            dataSource={data}
                            renderItem={(item:any) => (
                                <List.Item onClick={() => go_config(item)}>
                                    {item.code} - {item.name}
                                </List.Item>
                            )}
                        />
                    </Col>
                    <Col span={14} className={styles.right}>
                        <Row>
                            <Col span={24}>
                                <Title>AQ 数据校验系统</Title>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Button type="dashed">添加校验器</Button>
                            </Col>
                        </Row>

                    </Col>
                </Row>
            </Content>
        </Layout>
  );
}
