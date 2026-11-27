// Only /media/* reaches this. Static assets answer a Range request with the whole file,
// and a browser can't seek in a video served that way, so this returns the bytes asked for.
// ponytail: reads the whole file to cut a piece from it. Fine for a 2.5 MB clip; move big files to R2.
export default {
  async fetch(request, env) {
    const range = /^bytes=(\d*)-(\d*)$/.exec(request.headers.get("Range") ?? "");
    const wanted = new Request(request);
    wanted.headers.delete("Range");
    const asset = await env.ASSETS.fetch(wanted);
    const headers = new Headers(asset.headers);
    headers.set("Accept-Ranges", "bytes");
    if (!range || asset.status !== 200 || request.method !== "GET" || !(range[1] || range[2])) {
      return new Response(asset.body, { status: asset.status, headers });
    }

    const bytes = await asset.arrayBuffer();
    const size = bytes.byteLength;
    // "bytes=-500" means the last 500 bytes.
    const start = range[1] ? Number(range[1]) : Math.max(size - Number(range[2]), 0);
    const end = range[1] && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
    if (start > end) {
      headers.set("Content-Range", `bytes */${size}`);
      return new Response(null, { status: 416, headers });
    }
    headers.set("Content-Range", `bytes ${start}-${end}/${size}`);
    headers.set("Content-Length", String(end - start + 1));
    return new Response(bytes.slice(start, end + 1), { status: 206, headers });
  },
};
