"use strict";

// ici on gère nos commandes pour les charger ou en trouver une avec la fonction findCommand pour une command help

import Client from "../../main";
import {resolve} from "path";
import {ApplicationCommandManager, Collection, ApplicationCommandType} from "discord.js";
import {access, readdir, stat} from "fs/promises";
import Command from "./Command";

class CommandsManager {
    private _client: typeof Client;
    private _path: string;
    private _globalCommands: ApplicationCommandManager;

    constructor(client: typeof Client) {
        this._client = client;
        this._commands = new Collection();
        this._path = resolve(__dirname, "..", "commands");
        if (!this._client.application) throw new Error("Appication is null");
        this._globalCommands = this._client.application.commands;
    }

    private _commands: Collection<string, Command>;

    get commands() {
        return this._commands;
    }

    addCommand(command: Command) {
        this._commands.set(command.name.toLowerCase(), command);
    }

    findCommand(name: string) {
        if (!name || typeof name !== "string") return undefined;
        return this._commands.find((cmd) => {
            return cmd.name.toLowerCase() === name.toLowerCase();
        });
    }

    async loadCommands() {
        try {
            await access(this._path);
        } catch (error) {
            return;
        }

        await this._globalCommands.fetch();

        const categorys = await readdir(this._path);

        if (!categorys || categorys.length > 0) {

            for (const category of categorys) {
                const path = resolve(this._path, category);
                const stats = await stat(path);

                if (stats.isDirectory()) {
                    const commands = await readdir(path);

                    if (commands && commands.length > 0) {
                        for (const command of commands) {
                            const cmdPath = resolve(path, command);
                            const cmdStats = await stat(cmdPath);

                            if (cmdStats.isFile() && command.endsWith(".js")) {
                                this.addCommand(new (require(cmdPath)?.default));
                            }
                        }
                    }
                }
            }
        }


        if (this._globalCommands.cache.some(cmd =>
            (this._commands.get(cmd.name)?.description || "") !== cmd?.description ||
            (this._commands.get(cmd.name)?.options || []) !== cmd?.options
        ) || this._globalCommands.cache.size !== this._commands.size) {
            await this._globalCommands.set(this._commands.map((cmd) => {
                if (cmd.type !== ApplicationCommandType.ChatInput) return {
                    name: cmd.name,
                    type: cmd.type,
                    defaultMemberPermissions : cmd.userPerms,
                }
                else return {
                    name: cmd.name,
                    type: cmd.type,
                    description: cmd.description,
                    options: cmd.options,
                    defaultMemberPermissions : cmd.userPerms,
                }
            }));
            console.info("[Commands] Refresh the globals commands");
        }

    }
}

export default CommandsManager;