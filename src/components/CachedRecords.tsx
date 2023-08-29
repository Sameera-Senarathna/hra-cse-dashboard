import React, {FC, useEffect, useState} from "react";
import {Button, Drawer, Table} from "antd";
import {Content} from "../models/resources-list.model";
import {ColumnsType} from "antd/es/table";
import {getAllCachedData} from "../services/api-calls.service";

interface CachedRecordsProps {
    isDrawerOpen: boolean,
    setIsDrawerOpen: (status: boolean) => void
}
const CachedRecords: FC<CachedRecordsProps> = ({isDrawerOpen, setIsDrawerOpen}) => {

    const [cachedRecodeData, setCachedRecodeData] = useState<Content[]>();

    useEffect(() => {
        if(isDrawerOpen){
            getAllCachedData().then((apiResponseData) => {
                setCachedRecodeData(apiResponseData);
            })
        } else {
            setCachedRecodeData(undefined);
        }
    }, [isDrawerOpen])

    const columns: ColumnsType<Content> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 40
        },
        {
            title: 'Created Date',
            dataIndex: 'createdDate',
            key: 'createdDate',
            width: 160
        },
        {
            title: 'Modified Date',
            dataIndex: 'modifiedDate',
            key: 'modifiedDate',
            width: 160
        },
        {
            title: 'Telecom Product',
            dataIndex: 'telecomProduct',
            key: 'telecomProduct',
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            width: 60,
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
            width: 80,
        }
    ];

    const onClose = () => {
        setIsDrawerOpen(false);
    };

    return (
        <Drawer
            title="Cached Data"
            placement="right"
            onClose={onClose} open={isDrawerOpen}
            width={"1000px"}
        >
            <Table
                size="small"
                dataSource={cachedRecodeData}
                columns={columns}
                key="id"
            />
        </Drawer>
    )
}

export default CachedRecords;