"use strict";
import {ColorResolvable, Message, WebhookClientData, WebhookClientDataURL} from "discord.js";
import config from "../../config.json";

export interface ConfigFile {
    "bot": {
        "mainColor": ColorResolvable,
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



