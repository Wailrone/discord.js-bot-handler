/* eslint-disable no-undef */
"use strict";

import Command from "../../utils/Command";
import Context from "../../utils/Context";

export default class extends Command {
    constructor() {
        super({
            name: "userinfos",
            description: "Gives information about a user.",
            category: "utils",
            options: [{
                type: "USER",
                name: "user",
                description: "User to get information about.",
                required: true,
            }],
        });
    }

    async run(ctx: Context) {
        const targetUser = ctx.targetUser || ctx.args.getUser('user');
        const targetAvatarURL = targetUser.avatarURL({format: 'png'})

        await ctx.reply({
            ephemeral: !!ctx.targetUser,
            embeds: [
                {
                    title: `Profil de ${targetUser.tag}`,
                    color: (await targetUser.fetch())?.accentColor || ctx.client.config.bot.mainColor,
                    description: `<@${targetUser.id}>`,
                    thumbnail: {
                        url: targetAvatarURL || targetUser.defaultAvatarURL,
                    },
                    fields: [
                        {
                            name: `🆔 Identifiant`,
                            value: `\`\`\`${targetUser.id}\`\`\``
                        }
                    ]
                }
            ],
        })
    }
}
