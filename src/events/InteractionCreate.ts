"use strict";

import type {Interaction} from "discord.js";
import type Client from "../../main";
import CommandService from "../services/CommandService";
import DiscordEvent from "../utils/DiscordEvent";
import ComponentService from "../services/ComponentService";

class InteractionCreate extends DiscordEvent {
    commands: CommandService;
    components: ComponentService;

    constructor(client: typeof Client) {
        super(client, "interactionCreate");
        this.client = client;
        this.commands = new CommandService(this.client);
        this.components = new ComponentService(this.client);
    }

    async run(interaction: Interaction) {
        if (interaction.isCommand()) await this.commands.handle(interaction);
        if (interaction.isMessageComponent()) await this.components.handle(interaction)
    }
}

module.exports = InteractionCreate;