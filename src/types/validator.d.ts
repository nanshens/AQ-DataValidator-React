export interface ValidatorProps {
    id: string;
    code: string;
    name: string;
    active: boolean;
    entities: EntityProps[];
}

export interface EntityProps {
    id: string;
    code: string;
    name: string;
    active: boolean;
    attributes: AttributeProps[];
}

export interface AttributeProps {
    id: string;
    code: string;
    name: string;
    active: boolean;
    type: string;
    repairRules: RepairRuleProps[];
    validationRules: ValidationRuleProps[];
}

export interface ValidationRuleProps {
    id: string;
    code: string;
    name: string;
    active: boolean;
    type: string;
    length: number;
    relateEntity: string;
    relateAttribute: string;
    regexp: string;
    collection: string;
}

export interface RepairRuleProps {
    id: string;
    code: string;
    name: string;
    active: boolean;
    type: string;
    isRegexpReplace: boolean;
    replaceSource: string;
    replaceTarget: string;
    substringFormat: string;
}

