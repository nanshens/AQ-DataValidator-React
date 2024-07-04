
export enum AttributeType {
    Int = "int",
    Double = "double",
    String = "string",
    Boolean = "boolean",
    Date = "date",
    Time = "time",
    DateTime = "datetime",
    TimeStamp = "timestamp",
    Json = "json"
}

export enum ValidationRuleType {
    Length = "length",
    Unique = "unique",
    Relate = "relate",
    Collection = "collection",
    NotNull = "not_null",
    Regexp = "regexp"
}

export enum RepairRuleType {
    Replace = "replace",
    Substring = "substring"
}
