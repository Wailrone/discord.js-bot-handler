"use strict";

import {Client, Intents, LimitedCollection, Options,} from "discord.js";
import {ConfigFile} from "./src/utils/Constants"
import CommandsManager from "./src/utils/CommandsManager";
import EventsManager from "./src/utils/EventsManager.js";
import Logger from "./src/utils/Logger";
import * as config from "./config.json";
import ComponentsManager from "./src/utils/ComponentsManager";

class Bot extends Client {
    config: ConfigFile;
    logger: Logger;
    events: EventsManager;
    commands!: CommandsManager;
    components!: ComponentsManager;
    userCooldown: Map<string, boolean>;

    constructor() {
        super({
            restTimeOffset: 0,
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_MEMBERS,
                Intents.FLAGS.GUILD_BANS,
                Intents.FLAGS.GUILD_PRESENCES,
                Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
                Intents.FLAGS.GUILD_INTEGRATIONS,
                Intents.FLAGS.DIRECT_MESSAGES,
                Intents.FLAGS.DIRECT_MESSAGE_TYPING,
                Intents.FLAGS.GUILD_MESSAGE_TYPING],
            partials: ["CHANNEL"],
            makeCache: Options.cacheWithLimits({
                MessageManager: {
                    sweepInterval: 300,
                    sweepFilter: LimitedCollection.filterByLifetime({
                        lifetime: 900,
                        getComparisonTimestamp: e => e?.editedTimestamp ?? e?.createdTimestamp,
                    })
                },
                ThreadManager: {
                    sweepInterval: 3600,
                    sweepFilter: LimitedCollection.filterByLifetime({
                        getComparisonTimestamp: e => e.archiveTimestamp,
                        excludeFromSweep: e => !e.archived,
                    }),
                }
            }),
        });
        this.config = config as ConfigFile;
        this.logger = new Logger(`Shard #${this.shard?.ids?.toString() ?? "0"}`);
        this.events = new EventsManager(this);
        this.userCooldown = new Map();

        this.launch().then(async () => {
            this.commands = new CommandsManager(this);
            await this.commands.loadCommands().then(() => {
                this.logger.success(`[Commands] Loaded ${this.commands?.commands.size} commands`);
            }).catch((error) => {
                this.logger.error(`[CommandLoadError] An error occured when loading commands ${error}`, error.stack);
            });

            this.components = new ComponentsManager(this);
            await this.components.loadComponents().then(() => {
                this.logger.success(`[Components] Loaded ${this.components?.components.size} components`);
            }).catch((error) => {
                this.logger.error(`[ComponentLoadError] An error occured when loading components ${error}`, error.stack);
            });

            await this.logger.debug(`Connecté en tant que ${this.user.tag}`)

        }).catch(error => {
            this.logger.error(`[LaunchError] An error occured at startup ${error}`, error.stack);
        });
    }

    async launch() {
        await this.events.loadEvent();
        this.logger.success(`[Events] Loaded ${this.events.events.size} events`);

        try {
            await this.login(this.config.bot.token);
            this.logger.success("[WS] Connected to discord");
        } catch (error) {
            this.logger.error(`[WS] Connection error: ${error}`);
            return process.exit(1);
        }
    }
}

export default new Bot();
