import {Col, Layout, Row} from "antd";
const { Header, Footer, Sider, Content } = Layout;
import styles from './dict.less';

export default function DictPage() {

    return (
        <div>
            <Layout className={styles.layoutStyle}>
                <Header className={styles.headerStyle}>
                    <Row>
                        <Col span={12}>name</Col>
                        <Col span={12}>buttons</Col>
                    </Row>
                </Header>
                <Content className={styles.contentStyle}>
                    <Row>
                        <Col span={6}>entity</Col>
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
