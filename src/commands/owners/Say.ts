"use strict";

import Command from "../../utils/Command";
import Context from "../../utils/Context";
import {Emotes} from "../../utils/Constants";
import {ApplicationCommandOptionType} from "discord.js";

export default class extends Command {
    constructor() {
        super({
            name: "say",
            category: "owners",
            description: "Permet de faire parler le bot.",
            ownerOnly: true,
            options: [{
                type: ApplicationCommandOptionType.String,
                name: 'text',
                required: true,
                description: 'Texte.'
            }],
        });
    }

    async run(ctx: Context) {

        await ctx.reply({
            content: `${Emotes.SUCCESS} Message envoyé.`,
            ephemeral: true,
        })

        await ctx.channel.send({
            content: ctx.args.getString('text')
        })

    }

}
