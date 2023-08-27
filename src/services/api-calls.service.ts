import axiosInstance from "./axios.services";
import ResourcesListModel, {Content} from "../models/resources-list.model";
import backendEndpointConstants from "../constants/backend-endpoint.constants";
import MetaDateModel from "../models/meta-date.model";
import {AxiosError} from "axios";
import notificationService from "./notification.service";

export const getAllTelcoResources = async (page: number, size: number): Promise<ResourcesListModel> => {
    const apiResponse = await axiosInstance.get<ResourcesListModel>(
        backendEndpointConstants.GET_ALL_TELCO_RESOURCES,
        {
            params: {page, size}
        }
    )

    return apiResponse.data;

}


export const getTelcoResourceById = async (id: string): Promise<ResourcesListModel | null> => {
    try {
        const apiResponse = await axiosInstance.get<Content>(
            backendEndpointConstants.GET_TELCO_RESOURCES_BY_ID + "/" + id,
        )

        const convertedResponse: ResourcesListModel = {
            content: [apiResponse.data],
            numberOfElements: 1
        }

        return convertedResponse;
    } catch (error: any) {
        if(error.response.status === 404) {
            notificationService("warning", "Record Not Found");
            return null
        } else {
            throw error
        }
    }

}

export const createResource = async (
    apiResponseBody: {
        telecomProduct: string;
        category: string;
        priority: string;
        rating: string;
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
        rating: string;
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

export const getMetaData = async (
    recodeLimit?: string
): Promise<MetaDateModel[]> => {

    const apiResponse = await axiosInstance.get<MetaDateModel[]>(
        backendEndpointConstants.META_DATA,
        {
            params: {
                "record-limit": recodeLimit ?? "2"
            }
        }
    )

    return apiResponse.data;

}

export interface LoadTestDelayModel {
    loadTestId: string;
    delay: number;
}
export interface LoadTestHitRateModel {
    loadTestId: string;
    hitRate: number;
}

export interface LoadTestResults {
    delays: LoadTestDelayModel[];
    hitRates: LoadTestHitRateModel[]
}

export const startLoadTestWithTIme = async (testTime?: string): Promise<LoadTestResults> => {

    const apiResponse = await axiosInstance.get<{[0]: string, [1]: string}[]>(
        backendEndpointConstants.LOAD_TEST,
        {
            params: {
                "test-time": testTime ?? "3"
            }
        }
    )

    const loadTestDelays: LoadTestDelayModel[] = apiResponse.data.map((singleLoadTestResult, index) => {
        return {loadTestId: (index+ 1).toString(), delay: parseFloat(singleLoadTestResult[0])}
    })

    const loadTestHitRates: LoadTestHitRateModel[] = apiResponse.data.map((singleLoadTestResult, index) => {
        return {loadTestId: (index + 1).toString(), hitRate: parseFloat(singleLoadTestResult[1])}
    })

    return {delays: loadTestDelays, hitRates: loadTestHitRates};

}

export const getAllCachedData = async (): Promise<Content[]> => {

    const apiResponse = await axiosInstance.get<Content[]>(
        backendEndpointConstants.GET_CACHED_DATA,
    )

    return apiResponse.data;

}