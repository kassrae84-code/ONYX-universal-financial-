import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

export default {
    async fetch(request, env, ctx) {
        try {
            // Serve static files (like index.html) directly from Cloudflare's asset binding
            return await getAssetFromKV({
                request,
                waitUntil: ctx.waitUntil.bind(ctx),
            }, {
                ASSET_NAMESPACE: env.__STATIC_CONTENT,
            });
        } catch (e) {
            return new Response("Onyx One Sovereign Center // Asset Not Found", { status: 404 });
        }
    }
};
