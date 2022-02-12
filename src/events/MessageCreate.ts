"use strict";

import type Client from "../../main";
import DiscordEvent from "../utils/DiscordEvent";
import {TextChannel} from "discord.js";
import {NewMessage} from "../utils/Constants";
import DmChanneService from '../services/DmChannelService'

class MessageCreate extends DiscordEvent {
    dmChannel: DmChanneService;

    constructor(client: typeof Client) {
        super(client, "messageCreate");
        this.client = client;
        this.dmChannel = new DmChanneService(this.client)
    }

    async run(message: NewMessage) {
        if (!message.guild) return await this.dmChannel.handle(message)
        if (!(message.channel instanceof TextChannel)) return
    }
}

module.exports = MessageCreate;