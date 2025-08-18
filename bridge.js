import { getModuleFile } from "./native/file";

export function loadBridge() {
    const URL = Java.type("java.net.URL");
    const URLClassLoader = Java.type("java.net.URLClassLoader");
    const Class = Java.type("java.lang.Class");
    const Array = Java.type("java.lang.reflect.Array");

    const LOOKUP = "org.housingstudio.hsl.importer.ModuleBridgeProvider";

    const file = getModuleFile("hsl.jar");
    const url = file.toURL();

    const urls = Array.newInstance(URL.class, 1);
    urls[0] = url;

    const loader = new URLClassLoader(urls);
    Class.forName(LOOKUP, true, loader);

    const ModuleBridgeProvider = Java.type(LOOKUP);
    const bridge = ModuleBridgeProvider.provide();

    return bridge;
}
