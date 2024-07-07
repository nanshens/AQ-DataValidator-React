
export interface ExecutorProps {
    id: string;
    code: string;
    name: string;
    active: boolean;
    execute_time: string;
    validator_id: string;
    match_entities: any[];
    config: any[];
}
