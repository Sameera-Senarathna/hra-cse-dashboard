import React, {useEffect, useState} from 'react';
import './App.css';
import {
    Button,
    Col,
    Empty,
    Form,
    Input,
    Modal,
    Radio,
    Row,
    Select,
    Spin,
    Table,
    TablePaginationConfig, Tag,
    Tooltip
} from "antd";
import TelcoResourceModel from "./telco-resource.model";
import {ColumnsType} from "antd/es/table";
import {DatabaseOutlined, HomeOutlined, PlaySquareOutlined, SettingOutlined} from '@ant-design/icons';
import ResourcesListModel, {Content} from "./models/resources-list.model";
import {
    createResource,
    deleteResource,
    getAllTelcoResources, getMetaData,
    getTelcoResourceById, LoadTestResults, startLoadTestWithTIme,
    updateResource
} from "./services/api-calls.service";
import {useWatch} from "antd/es/form/Form";
import showNotification from "./services/notification.service";
import CategoryConstants from "./constants/Category.Constants";
import PriorityConstants from "./constants/Priority.constants";
import MetaDateModel from "./models/meta-date.model";
import notificationService from "./services/notification.service";
import {Line, Column} from '@ant-design/plots';
import CachedRecords from "./components/CachedRecords";
import CpuAndMemoryUsage from "./components/CpuAndMemoryUsage";

function App() {

    const [form] = Form.useForm();
    const createdWithValue = useWatch("createWith", form);
    const [metaDataRecodeLimit, setMetaDataRecodeLimit] = useState("10");

    const [loadTestTime, setLoadTestTime] = useState<string>("3");
    const [isLoadTestInProgess, setIsLoadTestInProgess] = useState<boolean>(false);

    const [loadTestResult, setLoadTestResult] = useState<LoadTestResults>();
    const [isCachedDataDrawerOepn, setIsCachedDataDrawerOepn] = useState<boolean>(false);

    const [resourceList, setResourceList] = useState<ResourcesListModel>();
    const [metaDataList, setMetaDataList] = useState<MetaDateModel[]>([]);
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

    useEffect(() => {
        clickSearchButton(undefined);
    }, []);

    const LineChartConfig = {
        data: (JSON.parse(JSON.stringify(metaDataList)) as MetaDateModel[]).reverse(),
        xField: 'id',
        yField: 'delay',
    };

    const startLoadTest = async () => {
        setIsLoadTestInProgess(true);
        setLoadTestResult(undefined);
        const loadTestResult = await startLoadTestWithTIme(loadTestTime);
        setLoadTestResult(loadTestResult);
        setIsLoadTestInProgess(false);
        await clickSearchButton(undefined);
    }

    const clickSearchButton = async (formInputs: any) => {
        try {
            if (!formInputs?.id) {
                const apiResponse = await getAllTelcoResources(1, paginationData.itemPerPage);
                const metaDataResponse = await getMetaData(metaDataRecodeLimit);
                setPaginationData((prevState) => {
                    return {...prevState, currentPage: 1}
                })
                setResourceList(apiResponse);
                setMetaDataList(metaDataResponse);
            } else {
                const apiResponse = await getTelcoResourceById(formInputs.id);
                if (apiResponse === null) {
                    const metaDataResponse = await getMetaData(metaDataRecodeLimit);
                    setMetaDataList(metaDataResponse);
                    return;
                }
                const metaDataResponse = await getMetaData(metaDataRecodeLimit);
                setPaginationData((prevState) => {
                    return {currentPage: 1, itemPerPage: 10}
                })
                setResourceList(apiResponse);
                setMetaDataList(metaDataResponse);
            }
        } catch (error) {
            notificationService("error", "API Error!!!");
        }
    }

    const tableOnChange = async (nextPageDetails: TablePaginationConfig) => {
        try {
            const newCurrentPage = (nextPageDetails.pageSize === paginationData.itemPerPage) ? nextPageDetails.current! : 1;
            setPaginationData({currentPage: newCurrentPage, itemPerPage: nextPageDetails.pageSize!});
            const apiResponse = await getAllTelcoResources(newCurrentPage, nextPageDetails.pageSize!);
            const metaDataResponse = await getMetaData(metaDataRecodeLimit);
            setResourceList(apiResponse);
            setMetaDataList(metaDataResponse);
        } catch (error) {
            notificationService("error", "API Error!!!");
        }
    }

    const deleteResourceConfirmationHandler = async () => {
        try {
            await deleteResource(deleteModelData.selectedResource!.id);
            await clickSearchButton(undefined);
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
                        rating: formValue.rating
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
                        rating: formValue.rating
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
            width: 40
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
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            width: 60,
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            width: 100,
        },
        {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
            width: 80,
        },
        {
            title: 'Actions',
            dataIndex: 'action',
            key: 'action',
            align: "center",
            width: 160,
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
                                    rating: record.rating
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

    const metaDataTableColumns: ColumnsType<MetaDateModel> = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: 'Request Type',
            dataIndex: 'requestType',
            render: (value, record, index) => {
                if (value.toUpperCase() === "GET") {
                    return <Tag color="green">GET</Tag>
                } else if (value.toUpperCase() === "POST") {
                    return <Tag color="blue">POST</Tag>
                } else if (value.toUpperCase() === "PUT") {
                    return <Tag color="yellow">PUT</Tag>
                } else if (value.toUpperCase() === "DELETE") {
                    return <Tag color="red">DELETE</Tag>
                } else {
                    return value;
                }
            }
        },
        {
            title: 'Request Status',
            dataIndex: 'requestStatus',
            render: (value, record, index) => {
                if (value.toUpperCase() === "SUCCESS") {
                    return <Tag color="green">SUCCESS</Tag>
                } else if (value.toUpperCase() === "FAILED") {
                    return <Tag color="red">Failed</Tag>
                } else {
                    return value;
                }
            }
        },
        {
            title: 'Date Time',
            dataIndex: 'dateTime',
        },
        {
            title: 'Hit Rate',
            dataIndex: 'hitRate',
        },
        {
            title: 'Delay',
            dataIndex: 'delay',
        },
    ]

    return (
        <>

            <div className="app-container">
                <div className="app-side-menu">
                    <Tooltip title="View Cached Data" placement="right">
                        <div className="menu-item" onClick={() => setIsCachedDataDrawerOepn(true)}>
                            <DatabaseOutlined style={{fontSize: 36}}/>
                        </div>
                    </Tooltip>
                    {/*<div className="menu-item">*/}
                    {/*    <HomeOutlined style={{fontSize: 36}}/>*/}
                    {/*</div>*/}
                    {/*<div className="menu-item">*/}
                    {/*    <PlaySquareOutlined style={{fontSize: 36}}/>*/}
                    {/*</div>*/}

                    {/*<div className="menu-item">*/}
                    {/*    <SettingOutlined style={{fontSize: 36}}/>*/}
                    {/*</div>*/}
                </div>
                <div className="app-content">
                    <Row>
                        <Col span={16} className="crud-section">
                            <div
                                style={{
                                    fontSize: 32,
                                    fontWeight: "bold",
                                    color: "white",
                                    lineHeight: "60px",
                                    background: "#2b2e4a",
                                    padding: "0px 16px",
                                    marginBottom: "12px"
                                }}
                            >
                                HRA CSE Dashboard
                            </div>
                            <div style={{paddingLeft: 12, paddingRight: 12, marginBottom: 8}}>
                                <Row>
                                    <Col span="24" className="search-input-form">
                                        <Form
                                            style={{justifyContent: "end"}}
                                            layout="inline"
                                            onFinish={clickSearchButton}
                                            size="small"
                                        >
                                            <Form.Item label="ID" name="id">
                                                <Input
                                                    onKeyPress={(event) => {
                                                        if (!/[0-9]/.test(event.key)) {
                                                            event.preventDefault();
                                                        }
                                                    }}
                                                />
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
                                                    onClick={() => {
                                                        form.resetFields();
                                                        setCreateNewModelData({
                                                            isOpen: true,
                                                            operation: "NEW",
                                                            selectedResource: null
                                                        })
                                                    }}
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
                                                showSizeChanger: resourceList && resourceList.totalElements! > 1,
                                                pageSizeOptions: [10, 25, 50],
                                                defaultPageSize: 10,
                                                size: "small",
                                                total: resourceList?.totalElements,
                                                pageSize: paginationData.itemPerPage,
                                                current: paginationData.currentPage
                                            }}
                                            scroll={{
                                                y: 250
                                            }}
                                            key="id"
                                        />
                                    </Col>
                                </Row>
                            </div>
                            <div style={{paddingLeft: 12, paddingRight: 12}}>
                                <Col span="24" className="section-header">
                                    Metadata
                                    <div>
                                        <span style={{fontSize: 14, fontWeight: "normal", paddingRight: 8}}>Record Limit:</span>
                                        <Input
                                            size="small"
                                            defaultValue={10}
                                            style={{width: 40}}
                                            onChange={(event) => setMetaDataRecodeLimit(event.target.value)}
                                            onKeyPress={(event) => {
                                                if (!/[0-9]/.test(event.key)) {
                                                    event.preventDefault();
                                                }
                                            }}
                                        />
                                    </div>
                                </Col>

                                <Col span="24" className="show-date-section">
                                    <Table
                                        size="small"
                                        dataSource={metaDataList}
                                        columns={metaDataTableColumns}
                                        key="id"
                                        pagination={false}
                                        scroll={{
                                            y: 330
                                        }}
                                    />
                                </Col>
                            </div>
                        </Col>
                        <Col span={8} className="analytic-section">
                            <Row>
                                <Col span="24" style={{padding: 12, display: 'flex'}}>
                                    <CpuAndMemoryUsage/>
                                </Col>
                                <Col span="24" style={{padding: "0px 12px"}}>
                                    <div style={{fontSize: 20, lineHeight: "20px", paddingBottom: "16px"}}>Latency</div>
                                    <Line
                                        {...LineChartConfig}
                                        height={120}
                                        yAxis={{
                                            title: {text: "Delay (ms)"}
                                        }}
                                        xAxis={{
                                            title: {text: "Request ID"}
                                        }}
                                    />
                                </Col>
                                <Col span="24" style={{padding: "12px 12px"}}>
                                    <div style={{fontSize: 20, lineHeight: "20px", paddingBottom: "16px"}}>Hit Rate</div>
                                    <Line
                                        data={(JSON.parse(JSON.stringify(metaDataList)) as MetaDateModel[]).reverse()}
                                        xField='id'
                                        yField='hitRate'
                                        height={120}
                                        yAxis={{
                                            title: {text: "Hit Rate %"}
                                        }}
                                        xAxis={{
                                            title: {text: "Request ID"}
                                        }}
                                    />
                                </Col>
                                <Col span={24}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: "space-between",
                                            padding: "8px",
                                            alignItems: 'center',
                                            background: 'lightgray',
                                            margin: "0 12px"
                                        }}
                                    >
                                        <span style={{fontWeight: "bold"}}> Load Testing</span>
                                        <div>
                                            <span>Test Time:</span>
                                            <Input
                                                style={{width: 40, margin: "0 8px"}}
                                                onChange={(event) => setLoadTestTime(event.target.value)}
                                                defaultValue={3}
                                                onKeyPress={(event) => {
                                                    if (!/[0-9]/.test(event.key)) {
                                                        event.preventDefault();
                                                    }
                                                }}
                                            />
                                            <Button
                                                onClick={() => {
                                                    startLoadTest()
                                                }}
                                            >
                                                {
                                                    isLoadTestInProgess && <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}>
                                                        <div className="lds-dual-ring"></div>
                                                        <span style={{paddingLeft: 8}}>Load Test In-Progress</span>
                                                    </div>
                                                }
                                                {
                                                    !isLoadTestInProgess && "Run Load Test"
                                                }
                                            </Button>
                                        </div>

                                    </div>
                                </Col>
                                {
                                    !loadTestResult &&
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: 200,
                                        width: "100%"
                                    }}>
                                        <Empty description="No Load Test Data"/>
                                    </div>
                                }
                                {
                                    loadTestResult?.delays &&
                                    <Col span={24} style={{padding: "12px 12px"}}>
                                        <Column
                                            data={loadTestResult.delays}
                                            height={130}
                                            xField="loadTestId"
                                            yField="delay"
                                            xAxis={{
                                                title: {
                                                    text: "Load Test ID"
                                                }
                                            }}
                                            yAxis={{
                                                title: {
                                                    text: "Throughput (1/s)"
                                                }
                                            }}
                                        />
                                    </Col>
                                }
                                {
                                    loadTestResult?.hitRates &&
                                    <Col span={24} style={{padding: "12px 12px"}}>
                                        <Column
                                            data={loadTestResult.hitRates}
                                            height={130}
                                            xField="loadTestId"
                                            yField="hitRate"
                                            xAxis={{
                                                title: {
                                                    text: "Load Test ID"
                                                }
                                            }}
                                            yAxis={{
                                                title: {
                                                    text: "Avg Delay (ms)"
                                                }
                                            }}
                                        />
                                    </Col>
                                }
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
                        rating: createNewModelData.operation === "EDIT" ? createNewModelData.selectedResource?.rating : undefined,
                    }}
                >
                    {
                        createNewModelData.operation === "EDIT" && (
                            <>
                                <Form.Item label="ID">{createNewModelData.selectedResource?.id}</Form.Item>
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
                            {
                                CategoryConstants.map((singleCategory) => {
                                    return <Select.Option key={singleCategory}
                                                          value={singleCategory}>{singleCategory}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>

                    <Form.Item name="priority" label="Priority" rules={[{required: true}]}>
                        <Select placeholder="Select Telecom Product Priority">
                            {
                                PriorityConstants.map((singlePriority) => {
                                    return <Select.Option key={singlePriority}
                                                          value={singlePriority}>{singlePriority}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>

                    <Form.Item name="rating" label="Rating" rules={[{required: true}]}>
                        <Input
                            onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                    event.preventDefault();
                                }
                            }}
                        />
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

            {
                isCachedDataDrawerOepn &&
                <CachedRecords isDrawerOpen={isCachedDataDrawerOepn} setIsDrawerOpen={setIsCachedDataDrawerOepn}/>
            }

        </>
    );
}

export default App;
