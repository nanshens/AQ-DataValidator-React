import {Button, Col, Layout, message, Row} from "antd";
const { Header, Footer, Sider, Content } = Layout;
import styles from './config.less';
import {useParams} from "react-router";
import React, {useEffect, useState} from "react";
import {getAllValidator, getValidatorInfo} from "@/services/api";
import CustomTable from "@/components/CustomTable";
import {AttributeProps, EntityProps, RepairRuleProps, ValidationRuleProps, ValidatorProps} from "@/types/validator";

export default function ConfigPage() {
    const urlParams  = useParams();
    const [validator, setValidator] = useState<ValidatorProps>({
        id: "", code: "", name: "", active: true, config: []
    });
    const [selectedEntityId, setSelectedEntityId] = useState<string>('');
    const [editableEntityId, setEditableEntityId] = useState<string>('');
    const [selectedAttrId, setSelectedAttrId] = useState<string>('');
    const [editableAttrId, setEditableAttrId] = useState<string>('');
    const [selectedRepairId, setSelectedRepairId] = useState<string>('');
    const [editableRepairId, setEditableRepairId] = useState<string>('');
    const [selectedValidationId, setSelectedValidationId] = useState<string>('');
    const [editableValidationId, setEditableValidationId] = useState<string>('');

    const setActiveEntityId = (id: string) => {
        setSelectedEntityId(id);
        setSelectedAttrId('');
    }

    const setActiveAttrId = (id: string) => {
        setSelectedAttrId(id);
    }

    const setEntityData = (entity: EntityProps[]) => {
        setValidator({...validator, config: entity})
    }

    const filterAttr = ():AttributeProps[] => {
        const entities: any[] = validator.config.filter((i:any) => i.id === selectedEntityId);
        if (entities.length == 1) {
            return entities[0].attributes;
        }
        return []
    }

    const setAttrData = (attrs: AttributeProps[]) => {
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

    const setValidationData = (validationRules: ValidationRuleProps[]) => {
        setValidator(prevState => {
            const entityIndex = prevState.config.findIndex((entity) => entity.id === selectedEntityId);
            const attrIndex = prevState.config[entityIndex].attributes.findIndex((entity) => entity.id === selectedAttrId);
            const newList = [...prevState.config];
            newList[entityIndex].attributes[attrIndex] = {
                ...newList[entityIndex].attributes[attrIndex],
                validationRules: validationRules
            };
            return {
                ...prevState,
                config: newList
            }
        })
    }

    const setRepairData = (repairRuleProps: RepairRuleProps[]) => {
        setValidator(prevState => {
            const entityIndex = prevState.config.findIndex((entity) => entity.id === selectedEntityId);
            const attrIndex = prevState.config[entityIndex].attributes.findIndex((entity) => entity.id === selectedAttrId);
            const newList = [...prevState.config];
            newList[entityIndex].attributes[attrIndex] = {
                ...newList[entityIndex].attributes[attrIndex],
                repairRules: repairRuleProps
            };
            return {
                ...prevState,
                config: newList
            }
        })
    }

    const findAttr = () => {
        const entities = validator.config.filter((i:any) => i.id === selectedEntityId);
        if (entities.length == 1) {
            const attributes = entities[0].attributes.filter((i:any) => i.id === selectedAttrId);
            if (attributes.length == 1) {
                return attributes[0]
            }
        }
        return null;
    }

    const filterValidationRule = ():ValidationRuleProps[] => {
        const attr = findAttr()
        if (attr != null){
            return attr.validationRules
        }
        return []
    }

    const filterRepairRule = ():RepairRuleProps[] => {
        const attr = findAttr()
        if (attr != null){
            return attr.repairRules
        }
        return []
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
                            setDataFunc={setEntityData}
                            selectedId={selectedEntityId}
                            setSelectedFunc={setActiveEntityId}
                            editableId={editableEntityId}
                            setEditableFunc={setEditableEntityId}
                        />
                    </Col>
                    <Col span={6}>
                        <Button>新加一行</Button>
                        <Button>导入</Button>
                        <CustomTable
                            data={filterAttr()}
                            setDataFunc={setAttrData}
                            selectedId={selectedAttrId}
                            setSelectedFunc={setActiveAttrId}
                            editableId={editableAttrId}
                            setEditableFunc={setEditableAttrId}
                        />
                    </Col>
                    <Col span={12}>
                        <Row>
                            <Col span={24}>
                                <Button>新加一行</Button>
                                <Button>导入</Button>
                                <CustomTable
                                    data={filterValidationRule()}
                                    setDataFunc={setValidationData}
                                    editableId={editableRepairId}
                                    setEditableFunc={setEditableRepairId}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Button>新加一行</Button>
                                <Button>导入</Button>
                                <CustomTable
                                    data={filterRepairRule()}
                                    setDataFunc={setRepairData}
                                    editableId={editableValidationId}
                                    setEditableFunc={setEditableValidationId}
                                />
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
