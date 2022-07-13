"use strict";
import {ColorResolvable, Message, WebhookClientDataURL} from "discord.js";
import config from "../../configuration.json";

export interface ConfigFile {
    "bot": {
        "mainColor": number,
        "errorWebhook": WebhookClientDataURL | string,
        "defaultContact": string,
        "token": string,
        "ownersIDs": string[]
    },
    "emotes": {
        "SUCCESS": string,
        "ERROR": string,
        "WARNING": string,
    },
}

/* If you want to customize the Message, you can change the values below */
export interface NewMessage extends Message {
}

export const Emotes = config.emotes;



