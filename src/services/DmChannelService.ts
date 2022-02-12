import Bot from '../../main'
import {Message} from "discord.js";

export default class DmChannelService {
    client: typeof Bot;

    constructor(client: typeof Bot) {
        this.client = client;
    }

    async handle(message: Message) {
        if (message.author.bot) return

    }

}