"use strict";


import type Context from "../../utils/Context";
import Command from "../../utils/Command";

export default class extends Command {
    constructor() {
        super({
            name: "User infos",
            category: "contextMenus",
            type: "USER",
            cooldown: 5000,
        });
    }

    async run(ctx: Context) {
        ctx.client.commands.findCommand('userinfos').run(ctx);
    }

}