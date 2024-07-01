import {EditableProTable, ProColumns} from "@ant-design/pro-components";
import React, {useContext, useEffect, useMemo, useState} from 'react';
import CustomTable from "@/components/CustomTable";
import {getAllValidator} from "@/services/api";


export default () => {
    const [dataSource, setDataSource] = useState<any[]>([]);

    useEffect(() => {
        setDataSource([
            {
                id: "1123"
            },
            {
                id: "113323"
            },
            {
                id: "1165723"
            }
        ])
    }, []);

    return (
        <CustomTable
            data={dataSource}
            setDataFunc={setDataSource}
        />
    );
};
