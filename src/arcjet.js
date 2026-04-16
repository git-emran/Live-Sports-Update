import arcjet, {
  detectBot,
  fixedWindow,
  shield,
  slidingWindow,
} from "@arcjet/node";

const arcjetKey = process.env.ARCJET_KEY;
const arcjetMode = process.env.ARCJET_MODE === "DRY_RUN" ? "DRY_RUN" : "LIVE";
const client = {
  key: arcjetKey,
};

if (!arcjetKey) throw new Error("ARCJET_KEY environment variable is missing");

export const httpArcjet = arcjetKey
  ? arcjet({
      client,
      key: arcjetKey,
      log: console,
      rules: [
        fixedWindow({
          characteristics: ["ip.src"],
          max: 100,
          window: "60s",
        }),
        shield({ mode: arcjetMode }),
        detectBot({
          mode: arcjetMode,
          allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:PREVIEW"],
        }),
        slidingWindow({ mode: arcjetMode, interval: "10s", max: 50 }),
      ],
    })
  : null;

export const wsArcjet = arcjetKey
  ? arcjet({
      client,
      key: arcjetKey,
      log: console,
      rules: [
        fixedWindow({
          characteristics: ["ip.src"],
          max: 100,
          window: "60s",
        }),
        shield({ mode: arcjetMode }),
        detectBot({
          mode: arcjetMode,
          allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:PREVIEW"],
        }),
        slidingWindow({ mode: arcjetMode, interval: "2s", max: 5 }),
      ],
    })
  : null;

export function securityMiddleware() {
  return async (req, res, next) => {
    const clientIp =
      req.ip ||
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket?.remoteAddress ||
      "127.0.0.1";

    if (!arcjetKey) return next();

    try {
      const decision = await httpArcjet.protect(req, { ip: clientIp });
      if (decision.isDenied()) {
        if (decision.reason.isRateLimit()) {
          return res.status(503).json({ error: "Too many requests" });
        }
        return res.status(403).json({ error: "forbidden" });
      }
    } catch (e) {
      console.error("arcjet middleware error", e);
      return res.status(503).json({ error: "Service unavailable" });
    }

    next();
  };
}
