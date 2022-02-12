"use strict";


import type Context from "../../utils/Context";
import Command from "../../utils/Command.js";
import {Emotes} from "../../utils/Constants";

export default class extends Command {
    constructor() {
        super({
            name: "help",
            category: "utils",
            description: "Display all the commands of the bot",
            options: [{
                type: "STRING",
                name: "command",
                description: "Get the help of this command",
                required: false,
            }],
            examples: ["help", "help botinfo"],
        });
    }

    async run(ctx: Context) {
        if (ctx.args.getString("command")) {
            const command: Command = ctx.client.commands.findCommand(ctx.args?.getString("command")?.toLowerCase())
            if (!command) return ctx.reply(`The command \`${ctx.args.getString("command")}\` doesn't exist.`);
            return ctx.reply({
                embeds: [{
                    color: ctx.client.config.bot.mainColor,
                    title: `Help - ${command.name}`,
                    description: command.description,
                    image: {
                        url: 'https://cdn.discordapp.com/attachments/841212595343982601/881955847511613450/Divider_2.gif'
                    },
                    fields: [
                        {
                            name: "Exemples",
                            value: command.examples.length > 0
                                ? command.examples.map((x) => "`" + x + "`").join("\n")
                                : "Aucun exemple",
                            inline: true
                        },
                    ]
                }]
            });
        }

        const category: string[] = [];

        ctx.client.commands.commands.each((command: Command) => {
            if (!category.includes(command.category) && !command.disabled) {
                category.push(command.category);
            }
        });

        await ctx.reply({
            embeds: [
                {
                    color: ctx.client.config.bot.mainColor,
                    title: `${Emotes.SUCCESS} Help`,
                    image: {
                        url: 'https://cdn.discordapp.com/attachments/841212595343982601/881955847511613450/Divider_2.gif'
                    },
                    fields: category.map(x => {
                        return {
                            name: x.toUpperCase(),
                            value: ctx.client.commands.commands.filter((cmd: Command) => cmd.category === x && !cmd.staffOnly).map((cmd: Command) => `\`${cmd.name}\``).join(", ")
                        };
                    }),
                }
            ],
            components: [{
                type: 1,
                components: [
                    {
                        type: 2,
                        label: "Example button",
                        style: 3,
                        customId: `example:${ctx.author.id}:${ctx.guild.id}`,
                    },
                ]
            }],
        });
    }

}
