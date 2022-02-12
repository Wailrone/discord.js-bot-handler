"use strict";


import type Context from "../../utils/Context";
import Component from "../../utils/Component";

export default class extends Component {
    constructor() {
        super({
            customId: "example",
            customIdParams: ["userId", "guildId"],
        });
    }

    async run(ctx: Context) {
        // Retourne donc les deux paramètres que vous avez placé dans le customId
        console.log(ctx.customIdParams)
    }
}