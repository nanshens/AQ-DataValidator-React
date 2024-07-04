import {Button, Col, Layout, Row, Upload, message} from "antd";
const { Header, Footer, Sider, Content } = Layout;
import styles from './execute.less';
import {history} from "@@/core/history";
import React, {useEffect, useState} from "react";
import {useParams} from "react-router";
import {ValidatorProps} from "@/types/validator";
import {getValidator} from "@/services/api";
import {UploadOutlined} from "@ant-design/icons";

export default function ExecutePage() {
    const urlParams  = useParams();
    const [validator, setValidator] = useState<ValidatorProps>({
        id: "", code: "", name: "", active: true, entities: []
    });

    useEffect(() => {
        getValidator(String(urlParams.id)).then((result) => {
            setValidator({id: "", code: "", name: "", active: true, entities: []});
            if (result.code == 200) {
                setValidator(result.data);
            }
        }).catch((error) => {
            setValidator({id: "", code: "", name: "", active: true, entities: []});
        })
    }, []);

    const beforeUpload = (file:any) => {
        const isCSV = file.type === 'text/csv';
        const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        console.log(file)
        if (!isCSV && !isExcel) {
            message.error(`${file.name} 不是一个CSV或Excel文件!`);
        }
        return isCSV || isExcel || Upload.LIST_IGNORE;
    }

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
                    <Row className={styles.fullHeight}>
                        <Col span={6}>
                            <Button >读取文件</Button>
                            <Upload action='/api/upload/validation/file' multiple={true} beforeUpload={beforeUpload}>
                                <Button icon={<UploadOutlined />}>上传文件</Button>
                            </Upload>

                        </Col>
                        <Col span={6}>

                        </Col>
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
