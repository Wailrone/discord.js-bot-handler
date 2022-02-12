"use strict";

import type Context from "./Context";

interface CommandInfo {
    customId: string;
    customIdParams?: string[];
}

export default abstract class Component {
    customId: string;
    customIdParams: string[];

    constructor(info: CommandInfo) {
        this.customId = info.customId;
        this.customIdParams = info.customIdParams || [];
    }

    abstract run(ctx: Context): void;
}