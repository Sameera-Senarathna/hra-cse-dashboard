const BackendEndpointConstants = {
    GET_ALL_TELCO_RESOURCES : "/telcoproductcatalog/gettelcoresources",
    GET_TELCO_RESOURCES_BY_ID : "/telcoproductcatalog/readthroughtelcoresource",
    DEFAULT_CREATE_RESOURCE: "/telcoproductcatalog/createtelcoresource",
    CACHING_CREATE_RESOURCE: "/telcoproductcatalog/writethroughtelcoresource",
    WRITEBACK_CREATE_RESOURCE: "/telcoproductcatalog/writebacktelcoresource",
    UPDATE_RESOURCE: "/telcoproductcatalog/updatetelcoresource",
    DELETE_RESOURCE: "/telcoproductcatalog/deletetelcoresource",
    META_DATA: "/telcoproductcatalog/getmetadata",
    LOAD_TEST: "/telcoproductcatalog/getloadtestresults",
    GET_CACHED_DATA: "/telcoproductcatalog/getallcacherecords",
    GET_CPU_USAGE: "/actuator/metrics/process.cpu.usage",
    GET_MEMORY_USAGE: "/actuator/metrics/jvm.memory.used",
}

export default  BackendEndpointConstants
;