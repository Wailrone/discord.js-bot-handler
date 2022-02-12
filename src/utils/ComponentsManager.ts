"use strict";

import Client from "../../main";
import {resolve} from "path";
import {Collection} from "discord.js";
import {access, readdir, stat} from "fs/promises";
import Component from "./Component";

export default class ComponentsManager {
    private _client: typeof Client;
    private _path: string;

    constructor(client: typeof Client) {
        this._client = client;
        this._components = new Collection();
        this._path = resolve(__dirname, "..", "components");
    }

    private _components: Collection<string, Component>;

    get components() {
        return this._components;
    }

    addComponent(component: Component) {
        this._components.set(component.customId.toLowerCase(), component);
    }

    findComponent(name: string) {
        if (!name || typeof name !== "string") return undefined;
        return this._components.find((comp) => {
            return comp.customId.toLowerCase() === name.toLowerCase();
        });
    }

    async loadComponents() {
        try {
            await access(this._path);
        } catch (error) {
            return;
        }
        const categorys = await readdir(this._path);
        if (!categorys || categorys.length > 0) {
            for (const category of categorys) {
                const path = resolve(this._path, category);
                const stats = await stat(path);
                if (stats.isDirectory()) {
                    const components = await readdir(path);
                    if (components && components.length > 0) {
                        for (const component of components) {
                            const compPath = resolve(path, component);
                            const compStats = await stat(compPath);
                            if (compStats.isFile() && component.endsWith(".js")) {
                                this.addComponent(new (require(compPath)?.default));
                            }
                        }
                    }
                }
            }
        }
    }
}