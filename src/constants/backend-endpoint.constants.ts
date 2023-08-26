const BackendEndpointConstants = {
    GET_ALL_TELCO_RESOURCES : "/telcoproductcatalog/gettelcoresources",
    GET_TELCO_RESOURCES_BY_ID : "/telcoproductcatalog/readthroughtelcoresource",
    DEFAULT_CREATE_RESOURCE: "/telcoproductcatalog/createtelcoresource",
    CACHING_CREATE_RESOURCE: "/telcoproductcatalog/writethroughtelcoresource",
    WRITEBACK_CREATE_RESOURCE: "/telcoproductcatalog/writebacktelcoresource",
    UPDATE_RESOURCE: "/telcoproductcatalog/updatetelcoresource",
    DELETE_RESOURCE: "/telcoproductcatalog/deletetelcoresource",
    META_DATA: "/telcoproductcatalog/getmetadata",
}

export default  BackendEndpointConstants
;