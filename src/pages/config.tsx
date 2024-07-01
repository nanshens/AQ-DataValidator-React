import {Button, Col, Layout, message, Row, Upload} from "antd";
const { Header, Footer, Sider, Content } = Layout;
import styles from './config.less';
import {useParams} from "react-router";
import React, {useEffect, useState} from "react";
import {getAllValidator, getValidatorInfo} from "@/services/api";
import CustomTable from "@/components/CustomTable";
import {AttributeProps, EntityProps, RepairRuleProps, ValidationRuleProps, ValidatorProps} from "@/types/validator";
import { history } from 'umi';
import { v4 as uuid4 } from 'uuid';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';


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

    const copyConfig = () => {

    }

    const saveConfig = () => {

    }

    const addEntity = () => {
        const uuid: string = "NEW-" + uuid4();
        const newEntity:EntityProps = {
            id: uuid,
            name: "",
            code: "",
            active: true,
            attributes: []
        }
        setValidator({...validator, config: [...validator.config, newEntity]});
        setSelectedEntityId(uuid)
    }

    const addAttr = () => {
        if (selectedEntityId === '') {
            message.error('请选择实体');
            return;
        }
        const uuid: string = "NEW-" + uuid4();
        const newAttr:AttributeProps = {
            id: uuid,
            name: "",
            code: "",
            active: true,
            type: "",
            validationRules: [],
            repairRules: []
        }

        setValidator(prevState => {
            const entityIndex = prevState.config.findIndex((entity:any) => entity.id === selectedEntityId);
            const newList = [...prevState.config];
            newList[entityIndex] = {
                ...newList[entityIndex],
                attributes: [...newList[entityIndex].attributes, newAttr]
            };
            return {
                ...prevState,
                config: newList
            }
        })
        setSelectedAttrId(uuid)
    }

    const addValidationRule = () => {
        if (selectedEntityId === '' || selectedAttrId === '') {
            message.error('请选择实体和属性');
            return;
        }
        const uuid: string = "NEW-" + uuid4();
        const newRule:ValidationRuleProps = {
            id: uuid,
            name: "",
            code: "",
            active: true,
            type: "",
            length: 0,
            relateEntity: "",
            relateAttribute: "",
            regexp: "",
            collection: []
        }

        setValidator(prevState => {
            const entityIndex = prevState.config.findIndex((entity) => entity.id === selectedEntityId);
            const attrIndex = prevState.config[entityIndex].attributes.findIndex((entity) => entity.id === selectedAttrId);
            const newList = [...prevState.config];
            newList[entityIndex].attributes[attrIndex] = {
                ...newList[entityIndex].attributes[attrIndex],
                validationRules: [...newList[entityIndex].attributes[attrIndex].validationRules, newRule]
            };
            return {
                ...prevState,
                config: newList
            }
        })
    }

    const addRepairRule = () => {
        if (selectedEntityId === '' || selectedAttrId === '') {
            message.error('请选择实体和属性');
            return;
        }
        const uuid: string = "NEW-" + uuid4();
        const newRule:RepairRuleProps = {
            id: uuid,
            name: "",
            code: "",
            active: true,
            type: "",
            isRegexpReplace: false,
            replaceSource: "",
            replaceTarget: "",
            substringFormat: ""
        }

        setValidator(prevState => {
            const entityIndex = prevState.config.findIndex((entity) => entity.id === selectedEntityId);
            const attrIndex = prevState.config[entityIndex].attributes.findIndex((entity) => entity.id === selectedAttrId);
            const newList = [...prevState.config];
            newList[entityIndex].attributes[attrIndex] = {
                ...newList[entityIndex].attributes[attrIndex],
                repairRules: [...newList[entityIndex].attributes[attrIndex].repairRules, newRule]
            };
            return {
                ...prevState,
                config: newList
            }
        })
    }

    const uploadProps: UploadProps = {
        name: 'file',
        action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    const uploadEntityProps: UploadProps = {...uploadProps, action: ""}
    const uploadAttrProps: UploadProps = {...uploadProps, action: ""}
    const uploadValidationRuleProps: UploadProps = {...uploadProps, action: ""}
    const uploadRepairRuleProps: UploadProps = {...uploadProps, action: ""}

    return (
    <div>
        <Layout className={styles.layoutStyle}>
            <Header className={styles.headerStyle}>
                <Row>
                    <Col span={6}>AQ-数据校验系统</Col>
                    <Col span={6}>{validator.code} - {validator.name}</Col>
                    <Col span={12}>
                        <Button onClick={() => history.push("/")}>主页</Button>
                        <Button onClick={() => history.push("/execute/" + urlParams.id)}>执行</Button>
                        <Button onClick={copyConfig}>复制配置</Button>
                        <Button onClick={() => history.push("/execute/" + urlParams.id)}>设置</Button>
                        <Button onClick={() => history.push("/history/" + urlParams.id)}>历史</Button>
                    </Col>
                </Row>
            </Header>
            <Content className={styles.contentStyle}>
                <Row className={styles.fullHeight}>
                    <Col span={6} className={styles.fullHeight}>
                        <Button onClick={addEntity}>添加实体</Button>
                        <Upload {...uploadEntityProps}>
                            <Button icon={<UploadOutlined />}>导入实体</Button>
                        </Upload>
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
                        <Button onClick={addAttr}>添加属性</Button>
                        <Upload {...uploadAttrProps}>
                            <Button icon={<UploadOutlined />}>导入属性</Button>
                        </Upload>
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
                                <Button onClick={addValidationRule}>添加校验条件</Button>
                                <Upload {...uploadValidationRuleProps}>
                                    <Button icon={<UploadOutlined />}>导入校验条件</Button>
                                </Upload>
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
                                <Button onClick={addRepairRule}>添加修复条件</Button>
                                <Upload {...uploadRepairRuleProps}>
                                    <Button icon={<UploadOutlined />}>导入修复条件</Button>
                                </Upload>
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
                                <Button onClick={saveConfig}>保存配置</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Content>
        </Layout>
    </div>
  );
};
