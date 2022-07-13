"use strict";


import type Context from "../../utils/Context";
import Command from "../../utils/Command";
import {ApplicationCommandType} from "discord.js";

export default class extends Command {
    constructor() {
        super({
            name: "User infos",
            category: "contextMenus",
            type: ApplicationCommandType.User,
            cooldown: 5000,
        });
    }

    async run(ctx: Context) {
        ctx.client.commands.findCommand('userinfos').run(ctx);
    }

}