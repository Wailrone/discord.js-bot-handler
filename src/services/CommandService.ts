"use strict";

import type Client from "../../main";
import {CommandInteraction, DMChannel, GuildChannel, Permissions, ThreadChannel, WebhookClient} from "discord.js";
import Context from "../utils/Context";
import {Emotes} from "../utils/Constants";

class CommandService {
    client: typeof Client;
    private _errorWebhook: WebhookClient

    constructor(client: typeof Client) {
        this.client = client;
        try {
            this._errorWebhook = new WebhookClient(client.config.bot.errorWebhook);
        } catch (e) {
        }
    }

    async handle(interaction: CommandInteraction) {
        const command = this.client.commands.findCommand(interaction.commandName);
        if (!command) return;

        if (interaction.channel instanceof DMChannel && !command.isAvailableInDM) return interaction.reply({
            ephemeral: true,
            content: `${Emotes.ERROR} **Cette commande n'est pas disponible en messages privés.**`
        })

        if (this.client.uptime < 2000) return interaction.reply({
            ephemeral: true,
            content: `${Emotes.WARNING} **Veuillez patienter, le bot démarre.**`
        })

        if (command.ownerOnly && !this.client.config.bot.ownersIDs.includes(interaction.user.id)) {
            return interaction.reply({
                ephemeral: true,
                content: `${Emotes.ERROR} **Désolé mais cette commande est réservée aux créateurs du bot.**`
            });
        }

        if (command.disabled && !this.client.config.bot.ownersIDs.includes(interaction.user.id)) {
            return interaction.reply({
                ephemeral: true,
                content: `${Emotes.ERROR} **Désolé mais cette commande est désactivée.**`
            });
        }

        if (this.client.userCooldown.get(`${interaction?.user?.id}/${command?.name}`) && !this.client.config?.bot?.ownersIDs?.includes(interaction.user.id)) {
            return interaction.reply({
                ephemeral: true,
                content: `⏰ **Vous êtes en cooldown, réessayez dans ${command.cooldown / 1000}s.**`
            });
        }

        if (interaction.channel instanceof GuildChannel || interaction.channel instanceof ThreadChannel) {
            const channelBotPerms = new Permissions(interaction.channel?.permissionsFor(interaction.guild.me));

            if (!interaction.guild.members.cache.get(interaction.user.id).permissions.has(command.userPerms)) {
                return interaction.reply(`${Emotes.ERROR} **Vous devez avoir les permissions suivantes : \`${command.userPerms}\` pour utiliser cette commande.**`);
            }

            if (!interaction.guild.me.permissions.has("EMBED_LINKS") || !channelBotPerms.has("EMBED_LINKS")) return interaction.reply(`${Emotes.ERROR} **Le bot doit avoir la permission \`EMBED_LINKS\` pour fonctionner correctement !**`);

            if (!interaction.guild.me.permissions.has(command.botPerms) || !channelBotPerms.has(command.botPerms)) {
                return interaction.reply(`${Emotes.ERROR} **Le bot doit avoir les permissions suivantes : \`${command.botPerms}\` pour exécuter cette commande.**`);
            }
        }

        const ctx = new Context(this.client, interaction);

        try {
            await command.run(ctx);
            this.client.userCooldown.set(`${interaction?.user?.id}/${command?.name}`, true);
            setTimeout(() => {
                this.client.userCooldown.delete(`${ctx?.author?.id}/${command?.name}`);
            }, command.cooldown);
            this.client.logger.info(`Command ${command.name} executed by ${ctx.member.user.username} in ${ctx.guild.name}`);
        } catch (error) {
            await this._errorWebhook.send({
                embeds: [{
                    color: 0xFF0000,
                    title: `${Emotes.ERROR} Une erreur est survenue.`,
                    fields: [
                        {
                            name: "Command",
                            value: `\`\`\`/${command.name}\`\`\``,
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

export default CommandService;