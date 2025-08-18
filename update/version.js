const MODULE_PATH = "./config/ChatTriggers/modules/HousingStudio"

export function loadMetadata() {
    return JSON.parse(FileLib.read(MODULE_PATH + "/metadata.json"));
}
