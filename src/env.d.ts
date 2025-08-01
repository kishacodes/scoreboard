/// <reference path="../.astro/types.d.ts" />
/// <reference types="@cloudflare/workers-types" />

declare namespace App {
    interface Locals {
        runtime: {
            env: {
                DB: D1Database;
            };
            ctx: ExecutionContext;
        };
        user?: {
            userid: string;
            email: string;
            role: string;
            [key: string]: unknown;
        }
    }
}
