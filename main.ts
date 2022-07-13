"use strict";

import {Client, IntentsBitField, LimitedCollection, Options, Partials,} from "discord.js";
import {ConfigFile} from "./src/utils/Constants"
import CommandsManager from "./src/utils/CommandsManager";
import EventsManager from "./src/utils/EventsManager.js";
import Logger from "./src/utils/Logger";
import * as config from "./configuration.json";
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
            rest: {
                offset : 0,
            },
            intents: [
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.GuildMembers,
                IntentsBitField.Flags.GuildBans,
                IntentsBitField.Flags.GuildMessageReactions,
                IntentsBitField.Flags.GuildIntegrations,
                IntentsBitField.Flags.GuildWebhooks,
                IntentsBitField.Flags.GuildEmojisAndStickers,
                IntentsBitField.Flags.GuildVoiceStates,
                IntentsBitField.Flags.DirectMessages,
                IntentsBitField.Flags.DirectMessageReactions,
                IntentsBitField.Flags.DirectMessageTyping,
                IntentsBitField.Flags.GuildScheduledEvents,
                IntentsBitField.Flags.GuildPresences,
                IntentsBitField.Flags.GuildMessageTyping,
            ],
            partials: [
                Partials.Channel,
            ],
            sweepers: {
                messages : {
                    interval : 300,
                    lifetime : 900,
                },
                threads : {
                    interval : 3600,
                    lifetime : 900,
                }
            }
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
