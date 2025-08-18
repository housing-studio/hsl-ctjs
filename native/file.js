const MODULE_PATH = "./config/ChatTriggers/modules/HousingStudio"

const Paths = Java.type('java.nio.file.Paths');

export function getWorkdir() {
    return Paths.get('.').toFile().getAbsoluteFile();
}

export function getFile(path) {
    return Paths.get(path).toFile();
}

export function listFiles(dirName) {
    const dir = getFile(dirName)
    if (!dir.exists())
        throw `file ${dirName} is does not exist`;

    if (!dir.isDirectory())
        throw `file ${dirName} is not a directory`;

    return dir.listFiles()
}

export function getModuleFile(path) {
    return getFile(MODULE_PATH + "/" + path)
}
