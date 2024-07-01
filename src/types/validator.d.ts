export interface ValidatorProps {
    id: string;
    code: string;
    name: string;
    active: boolean;
    config: EntityProps[];
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
    repairRule: RepairRuleProps[];
    validationRule: ValidationRuleProps[];
}

export interface RepairRuleProps {
    id: string;
    code: string;
    name: string;
    active: boolean;
    type: string;
    length: string;
    relateEntity: string;
    relateAttribute: string;
    collection: any[];
}

export interface ValidationRuleProps {
    id: string;
    code: string;
    name: string;
    active: boolean;
    type: string;
    length: string;
    relateEntity: string;
    relateAttribute: string;
    collection: any[];
}
