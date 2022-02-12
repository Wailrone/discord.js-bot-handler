"use strict";

import {ShardingManager} from "discord.js";
import Logger from "./src/utils/Logger";
import {bot} from "./config.json";
import {resolve} from "path";

const shardManagerLogger: Logger = new Logger("ShardingManager");

shardManagerLogger.info("Sharding manager starting !");

const processArgs = process.argv.slice(2);

new ShardingManager(resolve(__dirname, "main.js"), {
    respawn: true,
    totalShards: processArgs && parseInt(processArgs[1]) && processArgs[0] === "--shard" ? parseInt(processArgs[1]) : "auto",
    token: bot.token
}).on("shardCreate", (shard) => {
    shardManagerLogger.info(`Creating Shard #${shard.id}`);
}).spawn().then(() => {
    shardManagerLogger.success("All shards are launched !");
}).catch(err => {
    shardManagerLogger.error("An error has occurred ! " + err);
    return process.exit(1);
});
