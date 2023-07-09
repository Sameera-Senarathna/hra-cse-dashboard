import React, {useState} from 'react';
import './App.css';
import {Button, Checkbox, Col, Form, Input, Modal, Radio, Row, Select, Table} from "antd";
import TelcoResourceModel from "./telco-resource.model";
import {ColumnsType} from "antd/es/table";

import {HomeOutlined, PlaySquareOutlined, SettingOutlined, DatabaseOutlined} from '@ant-design/icons';

function App() {

    const [createNewModelData, setCreateNewModelData] = useState<{
        isOpen: boolean;
        operation: "NEW" | "EDIT" | "NONE";
        selectedResource: TelcoResourceModel | null
    }>({
        isOpen: false,
        operation: "NONE",
        selectedResource: null
    });

    const [deleteModelData, setDeleteModelData] = useState<{
        isOpen: boolean;
        selectedResource: TelcoResourceModel | null
    }>({
        isOpen: false,
        selectedResource: null
    })

    const dataSource = [
        {
            "id": 1,
            "createdDate": "2023-07-02T21:22:55",
            "modifiedDate": "2023-07-02T21:22:55",
            "telecomProduct": "string",
            "timeSchemaId": 0,
            "category": "string",
            "priority": 0
        },
        {
            "id": 2,
            "createdDate": "2023-07-02T21:15:27",
            "modifiedDate": "2023-07-02T21:17:49",
            "telecomProduct": "string888888",
            "timeSchemaId": 0,
            "category": "string",
            "priority": 0
        },
        {
            "id": 3,
            "createdDate": "2023-07-02T19:51:56",
            "modifiedDate": "2023-07-02T19:51:56",
            "telecomProduct": "DTV_PPS",
            "timeSchemaId": 1,
            "category": "DTV",
            "priority": 2
        },
        {
            "id": 4,
            "createdDate": "2023-07-02T21:22:55",
            "modifiedDate": "2023-07-02T21:22:55",
            "telecomProduct": "string",
            "timeSchemaId": 0,
            "category": "string",
            "priority": 0
        },
        {
            "id": 5,
            "createdDate": "2023-07-02T21:15:27",
            "modifiedDate": "2023-07-02T21:17:49",
            "telecomProduct": "string888888",
            "timeSchemaId": 0,
            "category": "string",
            "priority": 0
        },
        {
            "id": 6,
            "createdDate": "2023-07-02T19:51:56",
            "modifiedDate": "2023-07-02T19:51:56",
            "telecomProduct": "DTV_PPS",
            "timeSchemaId": 1,
            "category": "DTV",
            "priority": 2
        },
        {
            "id": 7,
            "createdDate": "2023-07-02T21:22:55",
            "modifiedDate": "2023-07-02T21:22:55",
            "telecomProduct": "string",
            "timeSchemaId": 0,
            "category": "string",
            "priority": 0
        },
        {
            "id": 8,
            "createdDate": "2023-07-02T21:15:27",
            "modifiedDate": "2023-07-02T21:17:49",
            "telecomProduct": "string888888",
            "timeSchemaId": 0,
            "category": "string",
            "priority": 0
        },
        {
            "id": 9,
            "createdDate": "2023-07-02T19:51:56",
            "modifiedDate": "2023-07-02T19:51:56",
            "telecomProduct": "DTV_PPS",
            "timeSchemaId": 1,
            "category": "DTV",
            "priority": 2
        },
        {
            "id": 10,
            "createdDate": "2023-07-02T19:51:56",
            "modifiedDate": "2023-07-02T19:51:56",
            "telecomProduct": "DTV_PPS",
            "timeSchemaId": 1,
            "category": "DTV",
            "priority": 2
        }
    ];

    const columns: ColumnsType<TelcoResourceModel> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Created Date',
            dataIndex: 'createdDate',
            key: 'createdDate',
        },
        {
            title: 'Modified Date',
            dataIndex: 'modifiedDate',
            key: 'modifiedDate',
        },
        {
            title: 'Telecom Product',
            dataIndex: 'telecomProduct',
            key: 'telecomProduct',
        },
        {
            title: 'Time Schema ID',
            dataIndex: 'timeSchemaId',
            key: 'timeSchemaId',
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
        },
        {
            title: 'Actions',
            dataIndex: 'action',
            key: 'action',
            align: "center",
            render: (_, record, index) => {
                return (
                    <div style={{textAlign: "center"}}>
                        <Button
                            size={"small"}
                            style={{marginRight: 8}}
                            onClick={() => {
                                setCreateNewModelData({
                                    isOpen: true,
                                    operation: "EDIT",
                                    selectedResource: record
                                })
                            }}
                        >
                            Update
                        </Button>
                        <Button
                            size={"small"}
                            onClick={() => {
                                setDeleteModelData({
                                    isOpen: true,
                                    selectedResource: record
                                })
                            }}
                            danger
                        >
                            Delete
                        </Button>
                    </div>
                )
            }
        }
    ];

    return (
        <>
            <div className="app-container">
                <div className="app-side-menu">
                    <div className="menu-item">
                        <HomeOutlined style={{fontSize: 36}}/>
                    </div>
                    <div className="menu-item">
                        <PlaySquareOutlined style={{fontSize: 36}}/>
                    </div>
                    <div className="menu-item">
                        <DatabaseOutlined style={{fontSize: 36}}/>
                    </div>
                    <div className="menu-item">
                        <SettingOutlined style={{fontSize: 36}}/>
                    </div>
                </div>
                <div className="app-content">
                    <Row>
                        <Col span={16} className="crud-section">
                            <div style={{paddingLeft: 12, paddingRight: 12}}>
                                <Row>
                                    <Col span="24" className="section-header">
                                        CRUD Section
                                    </Col>
                                    <Col span="24" className="search-input-form">
                                        <Form
                                            // form={form}
                                            style={{justifyContent: "end"}}
                                            layout="inline"
                                        >
                                            <Form.Item label="ID" name="id">
                                                <Input placeholder="Resource ID"/>
                                            </Form.Item>
                                            <Form.Item style={{marginInlineEnd: 8}}>
                                                <Button type="default">Search</Button>
                                            </Form.Item>
                                            <Form.Item style={{marginInlineEnd: 0}}>
                                                <Button
                                                    type="primary"
                                                    onClick={() => setCreateNewModelData({
                                                        isOpen: true,
                                                        operation: "NEW",
                                                        selectedResource: null
                                                    })}
                                                >
                                                    Create New
                                                </Button>
                                            </Form.Item>
                                        </Form>
                                    </Col>
                                    <Col span="24" className="show-date-section">
                                        <Table
                                            size="small"
                                            dataSource={dataSource}
                                            columns={columns}
                                            pagination={{
                                                showSizeChanger: true,
                                                pageSizeOptions: [5, 25, 50],
                                                defaultPageSize: 5,
                                                size: "default"
                                            }}
                                        />
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        <Col span={8} className="analytic-section">
                            <Row>
                                <Col span="24" className="section-header">
                                    Analytic Section
                                </Col>
                            </Row>

                        </Col>
                    </Row>
                </div>
            </div>
            <Modal
                title={createNewModelData.operation === "NEW" ? "Create New Telco Resource" : "Update Telco Resource"}
                open={createNewModelData.isOpen}
                onOk={() => {
                    setCreateNewModelData({isOpen: false, operation: "NONE", selectedResource: null})
                }}
                onCancel={() => {
                    setCreateNewModelData({isOpen: false, operation: "NONE", selectedResource: null})
                }}
                okText="Create"
                width={550}
                maskClosable={false}
                destroyOnClose={true}
            >
                <Form
                    name="createForm"
                    autoComplete="off"
                    style={{marginTop: 20}}
                    labelCol={{span: 10}}
                    initialValues={{
                        telecomProduct: createNewModelData.operation === "EDIT" ? createNewModelData.selectedResource?.telecomProduct : undefined,
                        category: createNewModelData.operation === "EDIT" ? createNewModelData.selectedResource?.category : undefined,
                        priority: createNewModelData.operation === "EDIT" ? createNewModelData.selectedResource?.priority : undefined,
                    }}
                >
                    {
                        createNewModelData.operation === "EDIT" && (
                            <>
                                <Form.Item label="ID">{createNewModelData.selectedResource?.id}</Form.Item>
                                <Form.Item
                                    label="Time Schema ID">{createNewModelData.selectedResource?.timeSchemaId}</Form.Item>
                                <Form.Item
                                    label="Created Time">{createNewModelData.selectedResource?.createdDate}</Form.Item>
                                <Form.Item
                                    label="Last Update Time">{createNewModelData.selectedResource?.createdDate}</Form.Item>
                            </>
                        )
                    }

                    <Form.Item
                        label="Telecom Product"
                        name="telecomProduct"
                        rules={[{required: true, message: 'Please input your Telecom Product!'}]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item name="category" label="Category" rules={[{required: true}]}>
                        <Select placeholder="Select Telecom Product Category">
                            <Select.Option value="CATEGORY_1">Category 1</Select.Option>
                            <Select.Option value="CATEGORY_2">Category 2</Select.Option>
                            <Select.Option value="CATEGORY_3">Category 3</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="priority" label="Priority" rules={[{required: true}]}>
                        <Select placeholder="Select Telecom Product Priority">
                            <Select.Option value={1}>Priority 1</Select.Option>
                            <Select.Option value={2}>Priority 2</Select.Option>
                            <Select.Option value={3}>Priority 3</Select.Option>
                        </Select>
                    </Form.Item>

                    {/*<Form.Item name="isCreateWithCaching" label="Create With Caching">*/}
                    {/*    <Checkbox/>*/}
                    {/*</Form.Item>*/}

                    {/*<Form.Item name="isCreateWithWriteBack" label="Create With Write Back">*/}
                    {/*    <Checkbox/>*/}
                    {/*</Form.Item>*/}

                    <Form.Item name="createWith" label="Create With" rules={[{required: true}]}>
                        <Radio.Group>
                            <Radio value="CACHING">Caching</Radio>
                            <Radio value="WRITE_BACK">Write Back</Radio>
                            <Radio value="DEFAULT">Default</Radio>
                        </Radio.Group>
                    </Form.Item>

                </Form>
            </Modal>
            <Modal
                title="Delete Resource"
                open={deleteModelData.isOpen}
                onOk={() => {
                    setDeleteModelData({isOpen: false, selectedResource: null})
                }}
                onCancel={() => {
                    setDeleteModelData({isOpen: false, selectedResource: null})
                }}
                okText="Delete"
                okButtonProps={{danger: true}}
                width={550}
                maskClosable={false}
            >
                <p style={{fontSize: 16}}>Are you sure you want to delete this resource?</p>
                <p style={{marginTop: 8}}>
                    <span style={{fontWeight: 500}}>ID: </span>
                    {deleteModelData.selectedResource?.id}
                </p>
                <p>
                    <span style={{fontWeight: 500}}>Telecom Product: </span>
                    {deleteModelData.selectedResource?.telecomProduct}
                </p>
                <p>
                    <span style={{fontWeight: 500}}>Category: </span>
                    {deleteModelData.selectedResource?.category}
                </p>
                <p>
                    <span style={{fontWeight: 500}}>Priority: </span>
                    {deleteModelData.selectedResource?.priority}
                </p>
            </Modal>
        </>
    );
}

export default App;
