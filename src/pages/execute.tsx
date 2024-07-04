import {Button, Col, Layout, Row} from "antd";
const { Header, Footer, Sider, Content } = Layout;
import styles from './execute.less';
import {history} from "@@/core/history";
import React, {useEffect, useState} from "react";
import {useParams} from "react-router";
import {ValidatorProps} from "@/types/validator";
import {getValidator} from "@/services/api";

export default function ExecutePage() {
    const urlParams  = useParams();
    const [validator, setValidator] = useState<ValidatorProps>({
        id: "", code: "", name: "", active: true, config: []
    });

    useEffect(() => {
        getValidator(String(urlParams.id)).then((result) => {
            setValidator({id: "", code: "", name: "", active: true, config: []});
            if (result.code == 200) {
                setValidator(result.data);
            }
        }).catch((error) => {
            setValidator({id: "", code: "", name: "", active: true, config: []});
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
                            <Button onClick={() => history.push("/")}>主页</Button>
                            <Button onClick={() => history.push("/config/" + urlParams.id)}>配置</Button>
                            <Button onClick={() => history.push("/history/" + urlParams.id)}>历史</Button>
                        </Col>
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
