import {RepairRuleProps, ValidationRuleProps} from "@/types/validator";

export interface ExecutorProps {
    id: string;
    code: string;
    name: string;
    active: boolean;
    execute_time: string;
    validator_id: string;
    match_entities: MatchEntityProps[];
    config: any[];
}

export interface MatchEntityProps {
    id: string;
    file_name: string;
    active: boolean;
    entity_id: string;
    entity_code: string;
    attributes: MatchAttributeProps[];
}

export interface MatchAttributeProps {
    id: string;
    column_name: string;
    active: boolean;
    attribute_id: string;
    attribute_code: string;
}
