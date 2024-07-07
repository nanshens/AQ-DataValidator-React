import {Button, Col, Layout, Row, Upload, message} from "antd";
const { Header, Footer, Sider, Content } = Layout;
import styles from './executor.less';
import {history} from "@@/core/history";
import React, {useEffect, useState} from "react";
import {useParams} from "react-router";
import {getExecutor, getFileEntities, getValidator} from "@/services/api";
import {UploadOutlined} from "@ant-design/icons";
import {ExecutorProps} from "@/types/executor";

export default function ExecutorPage() {
    const urlParams  = useParams();
    const [executor, setExecutor] = useState<ExecutorProps>({
        id: "", code: "", name: "", active: true, validator_id: '', execute_time: '', match_entities: [], config: []
    });



    useEffect(() => {
        getExecutor(String(urlParams.id)).then((result) => {
            setExecutor({id: "", code: "", name: "", active: true, validator_id: '', execute_time: '', match_entities: [], config: []});
            if (result.code == 200) {
                setExecutor(result.data);
            }
        }).catch((error) => {
            setExecutor({id: "", code: "", name: "", active: true, validator_id: '', execute_time: '', match_entities: [], config: []});
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

    const readFiles = () => {
        getFileEntities(String(urlParams.id)).then((result) => {
            setExecutor({id: "", code: "", name: "", active: true, validator_id: '', execute_time: '', match_entities: [], config: []});
            if (result.code == 200) {
                setExecutor(result.data);
            }
        }).catch((error) => {
            setExecutor({id: "", code: "", name: "", active: true, validator_id: '', execute_time: '', match_entities: [], config: []});
        })

    }

    return (
        <div>
            <Layout className={styles.layoutStyle}>
                <Header className={styles.headerStyle}>
                    <Row>
                        <Col span={6}>AQ-数据校验系统</Col>
                        <Col span={6}>{executor.code} - {executor.name}</Col>
                        <Col span={12}>
                            <Button onClick={() => history.push("/")}>主页</Button>
                            <Button onClick={() => history.push("/config/" + executor.validator_id)}>配置</Button>
                            <Button onClick={() => history.push("/history/" + urlParams.id)}>历史</Button>
                        </Col>
                    </Row>
                </Header>
                <Content className={styles.contentStyle}>
                    <Row className={styles.fullHeight}>
                        <Col span={6}>
                            <Button disabled={executor.execute_time != null} onClick={readFiles}>读取文件</Button>
                            <Upload action='/api/upload/validation/file' multiple={true} beforeUpload={beforeUpload} data={{id: urlParams.id}}>
                                <Button icon={<UploadOutlined />} disabled={executor.execute_time != null}>上传文件</Button>
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
