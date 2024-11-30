import { redis } from "@/db";
import { Ratelimit } from "@upstash/ratelimit";

export const ratelimit = {
  login: new Ratelimit({
    redis: redis,
    prefix: "ratelimit:login",
    limiter: Ratelimit.slidingWindow(5, "1m"),
  }),

  passwordReset: new Ratelimit({
    redis: redis,
    prefix: "ratelimit:passwordReset",
    limiter: Ratelimit.slidingWindow(3, "1h"),
  }),
};
