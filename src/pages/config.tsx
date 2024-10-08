import {Button, Col, Layout, message, Modal, Row, Upload} from "antd";
const { Header, Footer, Sider, Content } = Layout;
import styles from './config.less';
import {useParams} from "react-router";
import React, {useEffect, useState} from "react";
import {getAllExecutors, getAllValidator, getValidator, saveExecutor, saveValidator} from "@/services/api";
import CustomTable from "@/components/CustomTable";
import {AttributeProps, EntityProps, RepairRuleProps, ValidationRuleProps, ValidatorProps} from "@/types/validator";
import { history } from 'umi';
import { v4 as uuid4 } from 'uuid';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import {AttributeType, RepairRuleType, ValidationRuleType} from "@/types/enums";
import {ExecutorProps} from "@/types/executor";


export default function ConfigPage() {
    const urlParams  = useParams();
    const [validator, setValidator] = useState<ValidatorProps>({
        id: "", code: "", name: "", active: true, entities: []
    });
    const [executors, setExecutors] = useState<ExecutorProps[]>([]);
    const [selectedEntityId, setSelectedEntityId] = useState<string>('');
    const [editableEntityId, setEditableEntityId] = useState<string>('');
    const [selectedAttrId, setSelectedAttrId] = useState<string>('');
    const [editableAttrId, setEditableAttrId] = useState<string>('');
    const [selectedRepairId, setSelectedRepairId] = useState<string>('');
    const [editableRepairId, setEditableRepairId] = useState<string>('');
    const [selectedValidationId, setSelectedValidationId] = useState<string>('');
    const [editableValidationId, setEditableValidationId] = useState<string>('');
    const [showAllExecutorsModal, setShowAllExecutorsModal] = useState(false);

    const setActiveEntityId = (id: string) => {
        setSelectedEntityId(id);
        setSelectedAttrId('');
    }

    const setActiveAttrId = (id: string) => {
        setSelectedAttrId(id);
    }

    const setEntityData = (entity: EntityProps[]) => {
        setValidator({...validator, entities: entity})
    }

    const filterEntity = ():EntityProps[] => {
        return validator.entities.filter((i) => i.active);
    }

    const filterAttr = ():AttributeProps[] => {
        const entities = validator.entities.filter((i) => i.active && i.id === selectedEntityId);
        if (entities.length == 1) {
            return entities[0].attributes.filter((i) => i.active);
        }
        return []
    }

    const filterValidationRule = ():ValidationRuleProps[] => {
        const attr = findAttr()
        if (attr != null){
            return attr.validationRules.filter((i) => i.active);
        }
        return []
    }

    const filterRepairRule = ():RepairRuleProps[] => {
        const attr = findAttr()
        if (attr != null){
            return attr.repairRules.filter((i) => i.active);
        }
        return []
    }

    const setAttrData = (attrs: AttributeProps[]) => {
        setValidator(prevState => {
            const entityIndex = prevState.entities.findIndex((entity) => entity.id === selectedEntityId);
            const newList = [...prevState.entities];
            newList[entityIndex] = {
                ...newList[entityIndex],
                attributes: attrs
            };
            return {...prevState,entities: newList}
        })
    }

    const setValidationData = (validationRules: ValidationRuleProps[]) => {
        setValidator(prevState => {
            const entityIndex = prevState.entities.findIndex((entity) => entity.id === selectedEntityId);
            const attrIndex = prevState.entities[entityIndex].attributes.findIndex((entity) => entity.id === selectedAttrId);
            const newList = [...prevState.entities];
            newList[entityIndex].attributes[attrIndex] = {
                ...newList[entityIndex].attributes[attrIndex],
                validationRules: validationRules
            };
            return {...prevState,entities: newList}
        })
    }

    const setRepairData = (repairRuleProps: RepairRuleProps[]) => {
        setValidator(prevState => {
            const entityIndex = prevState.entities.findIndex((entity) => entity.id === selectedEntityId);
            const attrIndex = prevState.entities[entityIndex].attributes.findIndex((entity) => entity.id === selectedAttrId);
            const newList = [...prevState.entities];
            newList[entityIndex].attributes[attrIndex] = {
                ...newList[entityIndex].attributes[attrIndex],
                repairRules: repairRuleProps
            };
            return {...prevState,entities: newList}
        })
    }

    const findAttr = () => {
        const entities = validator.entities.filter((i) => i.active && i.id === selectedEntityId);
        if (entities.length == 1) {
            const attributes = entities[0].attributes.filter((i) => i.active && i.id === selectedAttrId);
            if (attributes.length == 1) {
                return attributes[0]
            }
        }
        return null;
    }

    useEffect(() => {
        getValidator(String(urlParams.id)).then((result) => {
            setValidator({id: "", code: "", name: "", active: true, entities: []});
            if (result.code == 200) {
                setValidator(result.data);
            }
        }).catch((error) => {
            setValidator({id: "", code: "", name: "", active: true, entities: []});
        })
        getAllExecutors(String(urlParams.id)).then((result) => {
            setExecutors([]);
            if (result.code == 200) {
                setExecutors(result.data);
            }
        }).catch((error) => {
            setExecutors([]);
        })
    }, []);

    const copyConfig = () => {

    }

    const saveConfig = () => {
        saveValidator(validator).then((result) => {
            if (result.code == 200) {
                setValidator(result.data);
                message.success("保存成功!")
            }
        }).catch((error) => {
            message.error("保存失败!")
        })
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
        setValidator({...validator, entities: [...validator.entities, newEntity]});
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
            const entityIndex = prevState.entities.findIndex((entity) => entity.id === selectedEntityId);
            const newList = [...prevState.entities];
            newList[entityIndex] = {
                ...newList[entityIndex],
                attributes: [...newList[entityIndex].attributes, newAttr]
            };
            return {...prevState, entities: newList}
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
            collection: ""
        }

        setValidator(prevState => {
            const entityIndex = prevState.entities.findIndex((entity) => entity.id === selectedEntityId);
            const attrIndex = prevState.entities[entityIndex].attributes.findIndex((entity) => entity.id === selectedAttrId);
            const newList = [...prevState.entities];
            newList[entityIndex].attributes[attrIndex] = {
                ...newList[entityIndex].attributes[attrIndex],
                validationRules: [...newList[entityIndex].attributes[attrIndex].validationRules, newRule]
            };
            return {...prevState, entities: newList}
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
            const entityIndex = prevState.entities.findIndex((entity) => entity.id === selectedEntityId);
            const attrIndex = prevState.entities[entityIndex].attributes.findIndex((entity) => entity.id === selectedAttrId);
            const newList = [...prevState.entities];
            newList[entityIndex].attributes[attrIndex] = {
                ...newList[entityIndex].attributes[attrIndex],
                repairRules: [...newList[entityIndex].attributes[attrIndex].repairRules, newRule]
            };
            return {...prevState, entities: newList}
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

    const entityColumns:any[] = [
        {"col": "code", "type": "string", "title": "实体"},
        {"col": "name", "type": "string", "title": "名称"}
    ]

    const attrColumns:any[] = [
        {"col": "code", "type": "string", "title": "字段"},
        {"col": "name", "type": "string", "title": "名称"},
        {"col": "type", "type": "select", "title": "类型", "options": Object.keys(AttributeType).map(val => ({"value": AttributeType[val as keyof typeof AttributeType], "label": val}))}
    ]

    const validationColumns:any[] = [
        {"col": "code", "type": "string", "title": "字段"},
        {"col": "name", "type": "string", "title": "名称"},
        {"col": "type", "type": "select", "title": "类型", "options": Object.keys(ValidationRuleType).map(val => ({"value": ValidationRuleType[val as keyof typeof ValidationRuleType], "label": val}))},
        {"col": "length", "type": "number", "parentColumn": "type", "title": "长度"},
        {"col": "relateEntity", "type": "string", "parentColumn": "type", "title": "关联实体"},
        {"col": "relateAttribute", "type": "string", "parentColumn": "type", "title": "关联属性"},
        {"col": "regexp", "type": "string", "parentColumn": "type", "title": "正则表达式"},
        {"col": "collection", "type": "string", "parentColumn": "type", "title": "集合"},
    ]

    const repairColumns:any[] = [
        {"col": "code", "type": "string", "title": "字段"},
        {"col": "name", "type": "string", "title": "名称"},
        {"col": "type", "type": "select", "title": "类型", "options": Object.keys(RepairRuleType).map(val => ({"value": RepairRuleType[val as keyof typeof RepairRuleType], "label": val}))},
        {"col": "isRegexpReplace", "type": "boolean", "parentColumn": "type", "title": "正则替换"},
        {"col": "replaceSource", "type": "string", "parentColumn": "type", "title": "原字符"},
        {"col": "replaceTarget", "type": "string", "parentColumn": "type", "title": "新字符"},
        {"col": "substringFormat", "type": "string", "parentColumn": "type", "title": "截取字符(a,b)"}
    ]

    const filterValidationColumns:any = {
        "type": {
            [ValidationRuleType.Length]: ["length"],
            [ValidationRuleType.Relate]: ["relateEntity", "relateAttribute"],
            [ValidationRuleType.Collection]: ["collection"],
            [ValidationRuleType.NotNull]: [],
            [ValidationRuleType.Unique]: [],
            [ValidationRuleType.Regexp]: ["regexp"],
        }
    }
    const filterRepairColumns:any = {
        "type": {
            [RepairRuleType.Replace]: ["isRegexpReplace", "replaceSource", "replaceTarget"],
            [RepairRuleType.Substring]: ["substringFormat"],
        }
    }

    const mergeEntityData = (editData:EntityProps) => {
        setValidator(prevState => {
            const entityIndex = prevState.entities.findIndex((entity) => entity.id === editData.id);
            const newList = [...prevState.entities];
            newList[entityIndex] = {
                ...newList[entityIndex],
                code: editData.code,
                name: editData.name,
            };
            return {...prevState, entities: newList}
        })
    }

    const mergeAttrData = (editData:AttributeProps) => {
        setValidator(prevState => {
            const entityIndex = prevState.entities.findIndex((entity) => entity.id === selectedEntityId);
            const attrIndex = prevState.entities[entityIndex].attributes.findIndex((entity) => entity.id === editData.id);
            const newList = [...prevState.entities];
            newList[entityIndex].attributes[attrIndex] = {
                ...newList[entityIndex].attributes[attrIndex],
                code: editData.code,
                name: editData.name,
                type: editData.type
            };
            return {...prevState, entities: newList}
        })
    }

    const mergeValidationData = (editData:ValidationRuleProps) => {
        setValidator(prevState => {
            const entityIndex = prevState.entities.findIndex((entity) => entity.id === selectedEntityId);
            const attrIndex = prevState.entities[entityIndex].attributes.findIndex((entity) => entity.id === selectedAttrId);
            const validationIndex = prevState.entities[entityIndex].attributes[attrIndex].validationRules.findIndex((entity) => entity.id === editData.id);
            const newList = [...prevState.entities];
            newList[entityIndex].attributes[attrIndex].validationRules[validationIndex] = {
                ...newList[entityIndex].attributes[attrIndex].validationRules[validationIndex],
                code: editData.code,
                name: editData.name,
                type: editData.type,
                length: editData.length,
                relateEntity: editData.relateEntity,
                relateAttribute: editData.relateAttribute,
                regexp: editData.regexp,
                collection: editData.collection,
            };
            return { ...prevState, entities: newList }
        })
    }

    const mergeRepairData = (editData:RepairRuleProps) => {
        setValidator(prevState => {
            const entityIndex = prevState.entities.findIndex((entity) => entity.id === selectedEntityId);
            const attrIndex = prevState.entities[entityIndex].attributes.findIndex((entity) => entity.id === selectedAttrId);
            const repairIndex = prevState.entities[entityIndex].attributes[attrIndex].repairRules.findIndex((entity) => entity.id === editData.id);
            const newList = [...prevState.entities];
            newList[entityIndex].attributes[attrIndex].repairRules[repairIndex] = {
                ...newList[entityIndex].attributes[attrIndex].repairRules[repairIndex],
                code: editData.code,
                name: editData.name,
                type: editData.type,
                isRegexpReplace: editData.isRegexpReplace,
                replaceSource: editData.replaceSource,
                replaceTarget: editData.replaceTarget,
                substringFormat: editData.substringFormat,
            };
            return { ...prevState, entities: newList }
        })
    }

    const deleteEntityItem = (id: string) => {
        setValidator(prevState => {
            const entityIndex = prevState.entities.findIndex((entity) => entity.id === id);
            const newList = [...prevState.entities];
            newList[entityIndex] = {
                ...newList[entityIndex],
                active: false
            };
            return { ...prevState, entities: newList }
        })
    }

    const deleteAttrItem = (id: string) => {
        setValidator(prevState => {
            const entityIndex = prevState.entities.findIndex((entity) => entity.id === selectedEntityId);
            const attrIndex = prevState.entities[entityIndex].attributes.findIndex((entity) => entity.id === id);
            const newList = [...prevState.entities];
            newList[entityIndex].attributes[attrIndex] = {
                ...newList[entityIndex].attributes[attrIndex],
                active: false,
            };
            return {...prevState, entities: newList}
        })
    }

    const deleteValidationItem = (id: string) => {
        setValidator(prevState => {
            const entityIndex = prevState.entities.findIndex((entity) => entity.id === selectedEntityId);
            const attrIndex = prevState.entities[entityIndex].attributes.findIndex((entity) => entity.id === selectedAttrId);
            const validationIndex = prevState.entities[entityIndex].attributes[attrIndex].validationRules.findIndex((entity) => entity.id === id);
            const newList = [...prevState.entities];
            newList[entityIndex].attributes[attrIndex].validationRules[validationIndex] = {
                ...newList[entityIndex].attributes[attrIndex].validationRules[validationIndex],
                active: false,
            };
            return { ...prevState, entities: newList }
        })
    }

    const deleteRepairItem = (id: string) => {
        setValidator(prevState => {
            const entityIndex = prevState.entities.findIndex((entity) => entity.id === selectedEntityId);
            const attrIndex = prevState.entities[entityIndex].attributes.findIndex((entity) => entity.id === selectedAttrId);
            const repairIndex = prevState.entities[entityIndex].attributes[attrIndex].repairRules.findIndex((entity) => entity.id === id);
            const newList = [...prevState.entities];
            newList[entityIndex].attributes[attrIndex].repairRules[repairIndex] = {
                ...newList[entityIndex].attributes[attrIndex].repairRules[repairIndex],
                active: false,
            };
            return { ...prevState, entities: newList }
        })
    }

    const showAllExecutors = () => {
    //     todo: 模态框 显示所有执行器
    }

    const createExecutor = () => {
        const executor = {
            id: "NEW-" + uuid4(),
            code: validator.code + "-" + (new Date()).toISOString(),
            name: validator.code + "-" + (new Date()).toISOString(),
            active: true,
            execute_time: '',
            validator_id: validator.id,
            match_entities: [],
            config: []
        }
        saveExecutor(executor).then((result) => {
            if (result.code == 200) {
                message.success("创建成功! 正在跳转...").then(e => {
                    history.push('/executor/' + result.data.id)
                })
            }
        }).catch((error) => {
            message.error("创建失败!")
        })
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
                        <Button onClick={createExecutor}>创建执行器</Button>
                        <Button onClick={() => setShowAllExecutorsModal(true)}>其他执行器</Button>
                        <Button onClick={copyConfig}>复制配置</Button>
                        <Button onClick={saveConfig}>保存配置</Button>
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
                            data={filterEntity()}
                            setDataFunc={setEntityData}
                            selectedId={selectedEntityId}
                            setSelectedFunc={setActiveEntityId}
                            editableId={editableEntityId}
                            setEditableFunc={setEditableEntityId}
                            columns={entityColumns}
                            mergeDataFunc={mergeEntityData}
                            deleteItemFunc={deleteEntityItem}
                        />
                    </Col>
                    <Col span={6}>
                        <Button onClick={addAttr}>添加属性</Button>
                        <Upload {...uploadAttrProps}>
                            <Button icon={<UploadOutlined />}>导入属性</Button>
                        </Upload>
                        <CustomTable
                            key={selectedEntityId}
                            data={filterAttr()}
                            setDataFunc={setAttrData}
                            selectedId={selectedAttrId}
                            setSelectedFunc={setActiveAttrId}
                            editableId={editableAttrId}
                            setEditableFunc={setEditableAttrId}
                            columns={attrColumns}
                            mergeDataFunc={mergeAttrData}
                            deleteItemFunc={deleteAttrItem}
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
                                    key={selectedAttrId}
                                    data={filterValidationRule()}
                                    setDataFunc={setValidationData}
                                    editableId={editableValidationId}
                                    setEditableFunc={setEditableValidationId}
                                    columns={validationColumns}
                                    mergeDataFunc={mergeValidationData}
                                    deleteItemFunc={deleteValidationItem}
                                    filterColumns={filterValidationColumns}
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
                                    key={selectedAttrId}
                                    data={filterRepairRule()}
                                    setDataFunc={setRepairData}
                                    editableId={editableRepairId}
                                    setEditableFunc={setEditableRepairId}
                                    columns={repairColumns}
                                    mergeDataFunc={mergeRepairData}
                                    deleteItemFunc={deleteRepairItem}
                                    filterColumns={filterRepairColumns}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Content>
        </Layout>
        <Modal title="执行器" open={showAllExecutorsModal} footer={null} closable={false} onCancel={() => setShowAllExecutorsModal(false)}>
            {executors.map((executor, index) => (
                <p key={executor.id} onClick={() => history.push("/executor/" + executor.id )}>{executor.code} - {executor.name}</p>
            ))}
        </Modal>
    </div>
  );
};
