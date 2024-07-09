import {Button, Col, Layout, Row, Upload, message} from "antd";
const { Header, Footer, Sider, Content } = Layout;
import styles from './executor.less';
import {history} from "@@/core/history";
import React, {useEffect, useState} from "react";
import {useParams} from "react-router";
import {getExecutor, getFileEntities, saveExecutor} from "@/services/api";
import {UploadOutlined} from "@ant-design/icons";
import {ExecutorProps, MatchAttributeProps, MatchEntityProps} from "@/types/executor";
import {AttributeProps, EntityProps, ValidatorProps} from "@/types/validator";
import CustomTable from "@/components/CustomTable";
import {AttributeType} from "@/types/enums";

export default function ExecutorPage() {
    const urlParams  = useParams();
    const [executor, setExecutor] = useState<ExecutorProps>({
        id: "", code: "", name: "", active: true, validator_id: '', execute_time: '', match_entities: [], config: []
    });
    const [validator, setValidator] = useState<ValidatorProps>({
        id: "", code: "", name: "", active: true, entities: []
    });

    const [selectedMatchEntityId, setSelectedMatchEntityId] = useState<string>('');
    const [editableMatchEntityId, setEditableMatchEntityId] = useState<string>('');
    const [editableMatchAttrId, setEditableMatchAttrId] = useState<string>('');

    useEffect(() => {
        getExecutor(String(urlParams.id)).then((result) => {
            setExecutor({id: "", code: "", name: "", active: true, validator_id: '', execute_time: '', match_entities: [], config: []});
            if (result.code == 200) {
                const data = result.data;
                setExecutor({
                    id: data.id, code: data.code, name: data.name, active: data.active, validator_id: data.validator_id,
                    execute_time: data.execute_time, match_entities: data.match_entities, config: data.config
                });
                setValidator(data.validator)
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

    const filterMatchEntity = ():MatchEntityProps[] => {
        return executor.match_entities;
    }

    const setMatchEntityData = (entity: MatchEntityProps[]) => {
        setExecutor({...executor, match_entities: entity})
    }

    const setActiveEntityId = (id: string) => {
        setSelectedMatchEntityId(id);
    }

    const matchEntityColumns = () => {
        const entities = validator.entities.filter((i) => i.active);
        return [
            {"col": "file_name", "type": "string", "disable": true},
            {"col": "entity_code", "type": "select", "options": entities.map(entity => ({"value": entity.code, "label": entity.code}))}
        ]
    }

    const mergeMatchEntityData = (editData:MatchEntityProps) => {
        const entityIndex = validator.entities.findIndex((entity) => entity.code === editData.entity_code);
        setExecutor(prevState => {
            const matchEntityIndex = prevState.match_entities.findIndex((entity) => entity.id === editData.id);
            const newList = [...prevState.match_entities];
            newList[matchEntityIndex] = {
                ...newList[matchEntityIndex],
                entity_id: validator.entities[entityIndex].id,
                entity_code: validator.entities[entityIndex].code,
            };
            return {...prevState, match_entities: newList}
        })
    }

    const deleteMatchEntityItem = (id: string) => {
        setExecutor(prevState => {
            const entityIndex = prevState.match_entities.findIndex((entity) => entity.id === id);
            const newList = [...prevState.match_entities];
            newList[entityIndex] = {
                ...newList[entityIndex],
                active: false
            };
            return { ...prevState, match_entities: newList }
        })
    }

    const filterMatchAttr = ():MatchAttributeProps[] => {
        const entities = executor.match_entities.filter((i) => i.active && i.id === selectedMatchEntityId);
        if (entities.length == 1) {
            return entities[0].attributes.filter((i) => i.active);
        }
        return []
    }

    const setMatchAttrData = (attrs: MatchAttributeProps[]) => {
        setExecutor(prevState => {
            const entityIndex = prevState.match_entities.findIndex((entity) => entity.id === selectedMatchEntityId);
            const newList = [...prevState.match_entities];
            newList[entityIndex] = {
                ...newList[entityIndex],
                attributes: attrs
            };
            return {...prevState,match_entities: newList}
        })
    }

    const matchAttrColumns = () => {
        let options:any[] = [];
        if (selectedMatchEntityId !== "") {
            const matchEntityIndex = executor.match_entities.findIndex((entity) => entity.id === selectedMatchEntityId);
            const entityIndex = validator.entities.findIndex((i) => i.active && i.code === executor.match_entities[matchEntityIndex].entity_code);
            if (entityIndex !== -1) {
                options = validator.entities[entityIndex].attributes.map(attr => ({"value": attr.code, "label": attr.code}));
            }
        }

        return [
            {"col": "column_name", "type": "string", "disable": true},
            {"col": "attribute_code", "type": "select", "options": options}
        ]
    }
    const mergeMatchAttrData = (editData:MatchAttributeProps) => {
        const matchEntityIndex = executor.match_entities.findIndex((entity) => entity.id === selectedMatchEntityId);
        const entityIndex = validator.entities.findIndex((i) => i.active && i.code === executor.match_entities[matchEntityIndex].entity_code);
        const attrIndex = validator.entities[entityIndex].attributes.findIndex(attr => attr.code === editData.attribute_code);
        setExecutor(prevState => {
            const matchAttrIndex = prevState.match_entities[matchEntityIndex].attributes.findIndex((entity) => entity.id === editData.id);
            const newList = [...prevState.match_entities];
            newList[matchEntityIndex].attributes[matchAttrIndex] = {
                ...newList[matchEntityIndex].attributes[matchAttrIndex],
                attribute_id: validator.entities[entityIndex].attributes[attrIndex].id,
                attribute_code: validator.entities[entityIndex].attributes[attrIndex].code,
            };
            return {...prevState, match_entities: newList}
        })
    }

    const deleteMatchAttrItem = (id: string) => {
        setExecutor(prevState => {
            const entityIndex = prevState.match_entities.findIndex((entity) => entity.id === selectedMatchEntityId);
            const attrIndex = prevState.match_entities[entityIndex].attributes.findIndex((entity) => entity.id === id);
            const newList = [...prevState.match_entities];
            newList[entityIndex].attributes[attrIndex] = {
                ...newList[entityIndex].attributes[attrIndex],
                active: false,
            };
            return {...prevState, match_entities: newList}
        })
    }

    const saveExecutorClick = () => {
        saveExecutor(executor).then((result) => {
            if (result.code == 200) {
                const data = result.data;
                setExecutor({
                    id: data.id, code: data.code, name: data.name, active: data.active, validator_id: data.validator_id,
                    execute_time: data.execute_time, match_entities: data.match_entities, config: data.config
                });
                setValidator(data.validator)
                message.success("保存成功!")
            }
        }).catch((error) => {
            message.error("保存失败!")
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
                            <Button onClick={saveExecutorClick}>保存执行器</Button>
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
                            <CustomTable
                                data={filterMatchEntity()}
                                setDataFunc={setMatchEntityData}
                                selectedId={selectedMatchEntityId}
                                setSelectedFunc={setActiveEntityId}
                                editableId={editableMatchEntityId}
                                setEditableFunc={setEditableMatchEntityId}
                                columns={matchEntityColumns()}
                                mergeDataFunc={mergeMatchEntityData}
                                deleteItemFunc={deleteMatchEntityItem}
                            />
                        </Col>
                        <Col span={12}>
                            <CustomTable
                                key={selectedMatchEntityId}
                                data={filterMatchAttr()}
                                setDataFunc={setMatchAttrData}
                                editableId={editableMatchAttrId}
                                setEditableFunc={setEditableMatchAttrId}
                                columns={matchAttrColumns()}
                                mergeDataFunc={mergeMatchAttrData}
                                deleteItemFunc={deleteMatchAttrItem}
                            />
                        </Col>
                    </Row>
                </Content>
            </Layout>
        </div>
    );
};
