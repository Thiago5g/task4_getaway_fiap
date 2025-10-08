import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';

interface SignatureHeaderParts {
  t: string;
  sig: string;
}

@Injectable()
export class SignatureMiddleware implements NestMiddleware {
  private readonly toleranceMs = 5 * 60 * 1000; // 5 min
  private secret = process.env.PAYMENT_WEBHOOK_SECRET || '';

  use(req: Request & { rawBody?: Buffer }, res: Response, next: NextFunction) {
    if (req.method !== 'POST') return next();
    if (!req.originalUrl.startsWith('/webhooks/payments')) return next();

    const header = req.header('X-Signature');
    if (!header) throw new UnauthorizedException('Missing signature header');

    const parsed = this.parse(header);
    const timestamp = parseInt(parsed.t, 10);
    if (isNaN(timestamp)) throw new UnauthorizedException('Invalid timestamp');

    const now = Date.now();
    if (Math.abs(now - timestamp) > this.toleranceMs) {
      throw new UnauthorizedException('Stale timestamp');
    }

    if (!req.rawBody) throw new UnauthorizedException('Raw body unavailable');

    const computed = this.computeSignature(parsed.t, req.rawBody);
    const valid = this.timingSafeEqual(
      Buffer.from(parsed.sig),
      Buffer.from(computed),
    );
    if (!valid) throw new UnauthorizedException('Invalid signature');

    return next();
  }

  private parse(header: string): SignatureHeaderParts {
    // Format: t=<timestamp>,sig=<hex>
    const parts = header
      .split(',')
      .reduce<Record<string, string>>((acc, kv) => {
        const [k, v] = kv.split('=');
        if (k && v) acc[k.trim()] = v.trim();
        return acc;
      }, {});
    if (!parts['t'] || !parts['sig'])
      throw new UnauthorizedException('Malformed signature header');
    return { t: parts['t'], sig: parts['sig'] };
  }

  private computeSignature(ts: string, raw: Buffer) {
    const data = `t=${ts}.${raw.toString('utf8')}`;
    return crypto.createHmac('sha256', this.secret).update(data).digest('hex');
  }

  private timingSafeEqual(a: Buffer, b: Buffer) {
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  }
}
