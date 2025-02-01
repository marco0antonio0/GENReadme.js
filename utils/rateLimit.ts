import rateLimit from "express-rate-limit";
import { NextApiRequest, NextApiResponse } from "next";

// Função auxiliar para middleware compatível com Next.js
export default function applyRateLimit(req: NextApiRequest, res: NextApiResponse) {
  return new Promise((resolve, reject) => {
    const limiter = rateLimit({
      windowMs: 1 * 60 * 1000, // 1 minuto
      max: 5, // Máximo de 5 requisições por IP no período
      message: { error: "Muitas requisições, tente novamente mais tarde." },
      keyGenerator: (req) => req.headers["x-forwarded-for"] || req.socket.remoteAddress || "global",
      standardHeaders: true,
      legacyHeaders: false,
    });

    limiter(req as any, res as any, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}
