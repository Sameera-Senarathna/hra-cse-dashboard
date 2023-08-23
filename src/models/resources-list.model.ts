export interface Pageable {
    sort: {
        sorted: boolean;
        unsorted: boolean;
        empty: boolean;
    };
    offset: number;
    pageNumber: number;
    pageSize: number;
    unpaged: boolean;
    paged: boolean;
}

export interface Content {
    id: number;
    createdDate: string;
    modifiedDate: string;
    telecomProduct: string;
    timeSchemaId: number;
    category: string;
    priority: number;
}

export interface Sort {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
}

export default interface ResourcesListModel {
    content: Content[];
    pageable?: Pageable;
    totalElements?: number;
    last?: boolean;
    totalPages?: number;
    size?: number;
    number?: number;
    sort?: Sort;
    numberOfElements: number;
    first?: boolean;
    empty?: boolean;
}