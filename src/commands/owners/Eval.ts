"use strict";

import Command from "../../utils/Command";
import Context from "../../utils/Context";
import {Emotes} from "../../utils/Constants";
import {ApplicationCommandOptionType, PermissionsBitField} from "discord.js";

export default class extends Command {
    constructor() {
        super({
            name: "eval",
            category: "owners",
            description: "Eval a code.",
            botPerms: [PermissionsBitField.Flags.Administrator],
            ownerOnly: true,
            options: [{
                type: ApplicationCommandOptionType.String,
                name: 'code',
                required: true,
                description: 'Code to execute.'
            }],
        });
    }

    async run(ctx: Context) {
        try {

            const content = ctx.args.getString('code')

            const result = new Promise(async (resolve) => resolve(eval(content)));

            return result.then((output: any) => {
                if (typeof output !== "string") {
                    output = require("util").inspect(output, {depth: 0});
                }
                if (output.includes(ctx.client.token)) {
                    output = output.replace(ctx.client.token, "T0K3N");
                }
                if (output === 'undefined') output = 'Aucun retour sur cette évaluation'
                output = wash(output)
                ctx.reply({
                    ephemeral: true,
                    embeds: [{
                        color: 0x2f3136,
                        fields: [
                            {
                                name: '📦 Code :',
                                value: `\`\`\`js\n${content}\`\`\``
                            },
                            {
                                name: '📦 Résultat',
                                value: `\`\`\`js\n${output}\`\`\``,
                            },
                        ],
                    }]
                });
            }).catch((err) => {
                err = err.toString();
                if (err.includes(ctx.client.token)) {
                    err = err.replace(ctx.client.token, "T0K3N");
                }
                err = wash(err)
                ctx.reply({
                    ephemeral: true,
                    embeds: [{
                        title: 'Résultat de l\'évaluation',
                        color: 0x2f3136,
                        fields: [
                            {
                                name: `${Emotes.ERROR} Il y a eu une erreur :`,
                                value: `\`\`\`js\n${err}\`\`\``
                            },
                        ],
                    }]
                });
            });

        } catch (err) {

        }
    }

}

function wash(text: string) {
    if (text.length > 800) {
        return `${text.slice(0, 800)}\n[...] + ${text.length - 800}`
    } else return text
}
