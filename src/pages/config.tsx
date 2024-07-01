import {Button, Col, Layout, message, Row} from "antd";
const { Header, Footer, Sider, Content } = Layout;
import styles from './config.less';
import {useParams} from "react-router";
import React, {useEffect, useState} from "react";
import {getAllValidator, getValidatorInfo} from "@/services/api";
import CustomTable from "@/components/CustomTable";
import {AttributeProps, EntityProps, ValidatorProps} from "@/types/validator";

export default function ConfigPage() {
    const urlParams  = useParams();
    const [validator, setValidator] = useState<ValidatorProps>({
        id: "", code: "", name: "", active: true, config: []
    });
    const [selectedEntityId, setSelectedEntityId] = useState<string>('');
    const [editableEntityId, setEditableEntityId] = useState<string>('');
    const [selectedAttrId, setSelectedAttrId] = useState<string>('');
    const [editableAttrId, setEditableAttrId] = useState<string>('');

    const setEntity = (entity: EntityProps[]) => {
        setValidator({...validator, config: entity})
    }

    const filterAttr = ():AttributeProps[] => {
        const entities: any[] = validator.config.filter((i:any) => i.id === selectedEntityId);
        if (entities.length > 0) {
            return entities[0].attributes;
        }
        return []
    }

    const setAttr = (attrs: AttributeProps[]) => {
        setValidator(prevState => {
            const entityIndex = prevState.config.findIndex((entity:any) => entity.id === selectedEntityId);
            const newList = [...prevState.config];

            newList[entityIndex] = {
                ...newList[entityIndex],
                attributes: attrs
            };

            return {
                ...prevState,
                config: newList
            }
        })
    }

    useEffect(() => {
        getValidatorInfo(String(urlParams.id)).then((result) => {
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
                        <CustomTable
                            data={validator.config}
                            setDataFunc={setEntity}
                            selectedId={selectedEntityId}
                            setSelectedFunc={setSelectedEntityId}
                            editableId={editableEntityId}
                            setEditableFunc={setEditableEntityId}
                        />
                    </Col>
                    <Col span={6}>
                        <Button>新加一行</Button>
                        <Button>导入</Button>
                        <CustomTable
                            data={filterAttr()}
                            setDataFunc={setAttr}
                            selectedId={selectedAttrId}
                            setSelectedFunc={setSelectedAttrId}
                            editableId={editableAttrId}
                            setEditableFunc={setEditableAttrId}
                        />
                    </Col>
                    <Col span={12}>
                        <Row>
                            <Col span={24}>
                                <Button>新加一行</Button>
                                <Button>导入</Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Button>新加一行</Button>
                                <Button>导入</Button>
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
