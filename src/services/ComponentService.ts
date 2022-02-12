import Bot from '../../main'
import {MessageComponentInteraction, WebhookClient} from "discord.js";
import Context from "../utils/Context";
import {Emotes} from "../utils/Constants";

export default class ComponentService {
    client: typeof Bot;
    private _errorWebhook: WebhookClient

    constructor(client: typeof Bot) {
        this.client = client;
        try {
            this._errorWebhook = new WebhookClient(client.config.bot.errorWebhook);
        } catch (e) {
        }
    }

    async handle(interaction: MessageComponentInteraction) {
        const component = this.client.components.findComponent(interaction.customId.split(':')?.[0]);
        if (!component) return;

        const ctx = new Context(this.client, interaction, component.customIdParams);

        try {
            await component.run(ctx);
        } catch (error) {
            await this._errorWebhook.send({
                embeds: [{
                    color: 0xFF0000,
                    title: `${Emotes.ERROR} Une erreur est survenue.`,
                    fields: [
                        {
                            name: "Component",
                            value: `\`\`\`/${component.customId}\`\`\``,
                        },
                        {
                            name: "Error",
                            value: `\`\`\`js\n${error}\`\`\``,
                        },
                        {
                            name: "User",
                            value: `\`\`\`${ctx.author.username}#${ctx.author.discriminator}\`\`\``,
                        },
                        {
                            name: "User ID",
                            value: `\`\`\`${ctx.author.id}\`\`\``,
                        },
                        {
                            name: "Guild",
                            value: `\`\`\`${ctx.guild?.name || `${ctx.author.tag}'s DMs`}\`\`\``,
                        },
                        {
                            name: "Channel",
                            value: `\`\`\`${ctx.channel?.name || `${ctx.author.tag}'s DMs`}\`\`\``,
                        },
                    ]
                }]
            });
            await interaction.reply(`${Emotes.ERROR} **Une erreur est survenue. Contactez ${ctx.client.config.bot.defaultContact || "un administrateur"}.**\`\`\`js\n${error}\`\`\``);
            this.client.logger.error(error);
        }

    }

}