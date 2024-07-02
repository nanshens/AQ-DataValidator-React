import React, {useContext, useEffect, useMemo, useState} from 'react';
import CustomTable from "@/components/CustomTable";
import {getAllValidator} from "@/services/api";
import Table from "@/pages/test";


export default () => {
    const [dataSource, setDataSource] = useState<any[]>([]);

    const data = [
        { name: 'John Doe', age: 28 },
        { name: 'Jane Smith', age: 32 },
    ];

    return (
        <Table data={data} />
    );
};
