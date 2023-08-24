import axiosInstance from "./axios.services";
import ResourcesListModel, {Content} from "../models/resources-list.model";
import backendEndpointConstants from "../constants/backend-endpoint.constants";

export const getAllTelcoResources = async (page: number, size: number): Promise<ResourcesListModel> => {
    const apiResponse = await axiosInstance.get<ResourcesListModel>(
        backendEndpointConstants.GET_ALL_TELCO_RESOURCES,
        {
            params: {page, size}
        }
    )

    return apiResponse.data;

}


export const getTelcoResourceById = async (id: string): Promise<ResourcesListModel> => {
    const apiResponse = await axiosInstance.get<Content>(
        backendEndpointConstants.GET_TELCO_RESOURCES_BY_ID + "/" + id,
    )

    const convertedResponse: ResourcesListModel = {
        content: [apiResponse.data],
        numberOfElements: 1
    }

    return convertedResponse;

}

export const createResource = async (
    apiResponseBody: {
        telecomProduct: string;
        category: string;
        priority: string;
        timeSchemaId: string;
    },
    createWith: "CACHING" | "WRITE_BACK" | "DEFAULT",
    bufferSize?: string
): Promise<"OPERATION SUCCESS"> => {

    if(createWith === "CACHING") {
        await axiosInstance.post(
            backendEndpointConstants.CACHING_CREATE_RESOURCE,
            apiResponseBody
        )
    } else if(createWith === "WRITE_BACK") {
        await axiosInstance.post(
            backendEndpointConstants.WRITEBACK_CREATE_RESOURCE,
            apiResponseBody,
            {
                params: {
                    "buffer-size": bufferSize
                }
            }
        )
    } else if(createWith === "DEFAULT") {
        await axiosInstance.post(
            backendEndpointConstants.DEFAULT_CREATE_RESOURCE,
            apiResponseBody
        )
    }

    return "OPERATION SUCCESS";

}

export const updateResource = async (
    apiResponseBody: {
        telecomProduct: string;
        category: string;
        priority: string;
        timeSchemaId: string;
    },
    id: number
): Promise<"OPERATION SUCCESS"> => {

    await axiosInstance.put(
        backendEndpointConstants.UPDATE_RESOURCE + "/" + id,
        apiResponseBody
    )

    return "OPERATION SUCCESS";

}

export const deleteResource = async (
    id: number
): Promise<"OPERATION SUCCESS"> => {

    await axiosInstance.delete(
        backendEndpointConstants.DELETE_RESOURCE + "/" + id,
    )

    return "OPERATION SUCCESS";

}