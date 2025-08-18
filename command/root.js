import { loadBridge } from "../bridge";
import { loadMetadata } from "../update/version";

export function handleRoot(args) {
    const cmd = args[0];
    if (!cmd || cmd == "help")
        return sendHelp();

    switch (cmd) {
        case "version":
            displayVersion();
            break;
        case "list":
            listGames();
            break;
        case "info":
            displayInfo(args[1]);
            break;
        case "import":
            importGame(args[1]);
            break;
        default:
            sendHelp();
    }
}

export function handleTab(args) {
    const options = ["help", "version", "list", "info", "import"];
    
    if (args.length == 0)
        return options;
    
    else if (args.length == 1) {
        const prefix = args[0]
        return options.filter(o => o.startsWith(prefix.toLowerCase()));
    }

    const command = args[0];
    if (command == "info") {
        const games = loadBridge().listGames();
        const jsGames = [];
        for (let i = 0; i < games.length; i++)
            jsGames.push(games[i].substring(0, games[i].length - 5))
        return jsGames;
    }

    return [];
}

function sendHelp() {
    const metadata = loadMetadata();

    ChatLib.chat(`&e&lHousing Studio &rv${metadata.version} - &7Help message`)
    ChatLib.chat("")
    ChatLib.chat(" &8/&7hsl import &8<&7game&8> - &fimport a HSL game to your house")
    ChatLib.chat(" &8/&7hsl list &8- &flist all games recognized by HSL")
    ChatLib.chat(" &8/&7hsl info &8<&7game&8> - &fdisplay information about a game")
    ChatLib.chat(" &8/&7hsl version &8- &fdisplay the mod's version")
}

function displayVersion() {
    const metadata = loadMetadata();
    ChatLib.chat("&e[HSL] &7Running version &f" + metadata.version);
}

function listGames() {
    const games = loadBridge().listGames()

    if (games.length == 0)
        return ChatLib.chat("&e[HSL] &cNo game files found.")

    const Stream = Java.type("java.util.stream.Stream");
    const Collectors = Java.type("java.util.stream.Collectors");
    
    const total = Stream.of(games)
        .collect(Collectors.joining(", "));
    
    ChatLib.chat("&e[HSL] &7Found game files: " + total)
}

function displayInfo(game) {
    if (!game)
        return ChatLib.chat("&e[HSL] &cYou must provide a game as an argument");

    const info = loadBridge().loadMetadata(game)
    if (!info)
        return ChatLib.chat("&e[HSL] &cCould not find game: '" + game + "'");

    ChatLib.chat("&e[HSL] &6Game information:");

    ChatLib.chat("&8• &7id&8: &f" + info.id());
    if (info.name())
        ChatLib.chat("&8• &7name&8: &f" + info.name());

    if (info.author())
        ChatLib.chat("&8• &7author&8: &f" + info.author());

    if (info.contributors()) {
        const Stream = Java.type("java.util.stream.Stream");
        const Collectors = Java.type("java.util.stream.Collectors");
        
        const total = Stream.of(info.contributors()).collect(Collectors.joining(", "));
        ChatLib.chat("&8• &7contributors&8: &f" + total);
    }

    if (info.description())
        ChatLib.chat("&8• &7description&8: &f" + info.description());

    ChatLib.chat("&8• &7version&8: &f" + info.version());
}

function importGame(game) {
    if (!game)
        return ChatLib.chat("&e[HSL] &cYou must provide a game as an argument");

    const bridge = loadBridge()
    
    const info = bridge.loadMetadata(game)
    if (!info)
        return ChatLib.chat("&e[HSL] &cCould not find game: '" + game + "'");

    ChatLib.chat("&e[HSL] &7Loading game: &f" + game + " &8(&fv" + info.version() + "&8)");

    if (!bridge.importGame(game))
        return ChatLib.chat("&e[HSL] &cError loading game")
}
