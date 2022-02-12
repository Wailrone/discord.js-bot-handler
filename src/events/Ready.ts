"use strict";

import type Client from "../../main";
import DiscordEvent from "../utils/DiscordEvent";

class InteractionCreate extends DiscordEvent {

    constructor(client: typeof Client) {
        super(client, "ready");
        this.client = client;
    }

    async run() {

    }
}

module.exports = InteractionCreate;