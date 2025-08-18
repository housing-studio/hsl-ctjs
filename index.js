import { loadBridge } from './bridge';
import { handleRoot, handleTab } from './command/root';

!function () {
    const original = register;
    this.register = function (type, n) {
        const newRegister = original(type, (function (...t) {
            try {
                return n.apply(this, t)
            } catch (t) {
                ((t, type) => {
                    try {
                        const 
                            n = t.fileName ? t.fileName.split(/[\\/]/).pop() : "Unknown File",
                            r = t.lineNumber || "Unknown Line";
                        console.error(`Uncaught Exception in Trigger: ${type}\nFile: ${n}:${r}\nError: ${t.message}\nStacktrace: \n${t.stack}`)
                        ChatLib.chat("&c----------------------------------------"),
                        ChatLib.chat("&c>> Uncaught Exception in Trigger <<"),
                        ChatLib.chat(`&c   Type: &f${type}`),
                        ChatLib.chat(`&c   File: ${n}:${r}`),
                        ChatLib.chat(`&c   Error: &f${t.message}`),
                        ChatLib.chat("&c----------------------------------------");
                    } catch (t) { }
                })(t, type)
            }
        }));
        return newRegister
    }
}();

register("command", ...args => handleRoot(args || []))
    .setTabCompletions(args => handleTab(args || []))
    .setName("hsl");

register("worldLoad", () => {
    loadBridge().onLoad()
})

register("worldUnload", () => {
    loadBridge().onLoad()
})

register("chat", function(event) {
    let message = new Message(EventLib.getMessage(event)).getUnformattedText();
    loadBridge().onMessage(event, message);
})

register("guiOpened", event => {
    loadBridge().onContainerOpen(event);
});

register("guiRender", event => {
    //const container = Player.getContainer()
    //ChatLib.chat("gui render: " + container.getName())
});

