import React, {useState} from 'react';
import './App.css';
import {Button, Col, Form, Input, Modal, Radio, Row, Select, Spin, Table, TablePaginationConfig} from "antd";
import TelcoResourceModel from "./telco-resource.model";
import {ColumnsType} from "antd/es/table";

import {DatabaseOutlined, HomeOutlined, PlaySquareOutlined, SettingOutlined} from '@ant-design/icons';
import ResourcesListModel, {Content} from "./models/resources-list.model";
import {
    createResource,
    deleteResource,
    getAllTelcoResources,
    getTelcoResourceById,
    updateResource
} from "./services/api-calls.service";
import {useWatch} from "antd/es/form/Form";
import showNotification from "./services/notification.service";

function App() {

    const [form] = Form.useForm();
    const createdWithValue = useWatch("createWith", form);

    const [resourceList, setResourceList] = useState<ResourcesListModel>();
    const [paginationData, setPaginationData] = useState<{
        currentPage: number,
        itemPerPage: number,
    }>({
        currentPage: 1,
        itemPerPage: 10
    });

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
    });

    const clickSearchButton = async (formInputs: any) => {
        if (!formInputs?.id) {
            const apiResponse = await getAllTelcoResources(1, paginationData.itemPerPage);
            setPaginationData((prevState) => {
                return {...prevState, currentPage: 1}
            })
            setResourceList(apiResponse);
        } else {
            const apiResponse = await getTelcoResourceById(formInputs.id);
            setPaginationData((prevState) => {
                return {currentPage: 1, itemPerPage: 10}
            })
            setResourceList(apiResponse);
        }
    }

    const tableOnChange = (nextPageDetails: TablePaginationConfig) => {
        const newCurrentPage = (nextPageDetails.pageSize === paginationData.itemPerPage) ? nextPageDetails.current! : 1;
        setPaginationData({currentPage: newCurrentPage, itemPerPage: nextPageDetails.pageSize!})
        getAllTelcoResources(newCurrentPage, nextPageDetails.pageSize!).then((apiResponse) => {
            setResourceList(apiResponse);
        })
    }

    const deleteResourceConfirmationHandler = async () => {
        try {
            await deleteResource(deleteModelData.selectedResource!.id);
            setDeleteModelData({isOpen: false, selectedResource: null});
            showNotification("success", "Resource Deleted Successfully");
        } catch (error) {

        }
    }

    const submitCreateOrEditForm = async () => {

        try {
            const formValue = await form.validateFields();

            if (createNewModelData.operation === "NEW") {

                await createResource(
                    {
                        category: formValue.category,
                        priority: formValue.priority,
                        telecomProduct: formValue.telecomProduct,
                        timeSchemaId: formValue.timeSchemaId
                    },
                    formValue.createWith,
                    formValue.bufferSize
                )
                showNotification("success", "Resource Created Successfully");

            } else if (createNewModelData.operation === "EDIT") {
                await updateResource(
                    {
                        category: formValue.category,
                        priority: formValue.priority,
                        telecomProduct: formValue.telecomProduct,
                        timeSchemaId: formValue.timeSchemaId
                    },
                    createNewModelData.selectedResource!.id
                )
                showNotification("success", "Resource Updated Successfully");
            }

            await clickSearchButton(undefined);
            setCreateNewModelData({isOpen: false, operation: "NONE", selectedResource: null});
            form.resetFields();

        } catch (error) {

        }


    }

    const columns: ColumnsType<Content> = [
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
                                form.setFieldsValue({
                                    category: record.category,
                                    priority: record.priority,
                                    telecomProduct: record.telecomProduct,
                                    timeSchemaId: record.timeSchemaId
                                })
                                setCreateNewModelData({
                                    isOpen: true,
                                    operation: "EDIT",
                                    selectedResource: record
                                });
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
                                            style={{justifyContent: "end"}}
                                            layout="inline"
                                            onFinish={clickSearchButton}
                                        >
                                            <Form.Item label="ID" name="id">
                                                <Input placeholder="Resource ID"/>
                                            </Form.Item>
                                            <Form.Item style={{marginInlineEnd: 8}}>
                                                <Button
                                                    type="default"
                                                    htmlType="submit"
                                                >
                                                    Search
                                                </Button>
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
                                            dataSource={resourceList?.content}
                                            columns={columns}
                                            onChange={tableOnChange}
                                            pagination={{
                                                showSizeChanger: resourceList && resourceList.numberOfElements > 1,
                                                pageSizeOptions: [10, 25, 50],
                                                defaultPageSize: 10,
                                                size: "default",
                                                total: resourceList?.numberOfElements,
                                                pageSize: paginationData.itemPerPage,
                                                current: paginationData.currentPage
                                            }}
                                            key="id"
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
                onOk={submitCreateOrEditForm}
                onCancel={() => {
                    form.resetFields();
                    setCreateNewModelData({isOpen: false, operation: "NONE", selectedResource: null})
                }}
                okText={createNewModelData.operation === "NEW" ? "Create" : "Update"}
                width={550}
                maskClosable={false}
                destroyOnClose={true}
            >
                <Form
                    form={form}
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
                                <Form.Item label="Time Schema ID">{createNewModelData.selectedResource?.timeSchemaId}</Form.Item>
                                <Form.Item label="Created Time">{createNewModelData.selectedResource?.createdDate}</Form.Item>
                                <Form.Item label="Last Update Time">{createNewModelData.selectedResource?.createdDate}</Form.Item>
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

                    <Form.Item name="timeSchemaId" label="Time Schema ID" rules={[{required: true}]}>
                        <Input
                            onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                    event.preventDefault();
                                }
                            }}/>
                    </Form.Item>

                    {
                        createNewModelData.operation === "NEW" && (
                            <Form.Item name="createWith" label="Create With" rules={[{required: true}]}>
                                <Radio.Group>
                                    <Radio value="CACHING">Caching</Radio>
                                    <Radio value="WRITE_BACK">Write Back</Radio>
                                    <Radio value="DEFAULT">Default</Radio>
                                </Radio.Group>
                            </Form.Item>
                        )
                    }



                    {
                        createdWithValue === "WRITE_BACK" &&
                        <Form.Item name="bufferSize" label="Buffer Size" rules={[{required: true}]}>
                            <Input
                                onKeyPress={(event) => {
                                    if (!/[0-9]/.test(event.key)) {
                                        event.preventDefault();
                                    }
                                }}/>
                        </Form.Item>
                    }

                </Form>
            </Modal>


            <Modal
                title="Delete Resource"
                open={deleteModelData.isOpen}
                onOk={deleteResourceConfirmationHandler}
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
