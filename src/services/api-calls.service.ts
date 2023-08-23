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