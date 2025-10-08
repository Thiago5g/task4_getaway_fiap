import { SignatureMiddleware } from './signature.middleware';
import { UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';

describe('SignatureMiddleware', () => {
  const secret = 'test_secret_1234567890';
  let middleware: SignatureMiddleware;

  const buildReq = (bodyObj: any, ts: number) => {
    const raw = Buffer.from(JSON.stringify(bodyObj));
    // replicar lógica do middleware (t=<ts>.<raw>)
    const data = `t=${ts}.${raw.toString('utf8')}`;
    const sig = crypto.createHmac('sha256', secret).update(data).digest('hex');
    return {
      method: 'POST',
      originalUrl: '/webhooks/payments',
      header: (name: string) =>
        name === 'X-Signature' ? `t=${ts},sig=${sig}` : undefined,
      rawBody: raw,
      body: bodyObj,
    } as any;
  };

  beforeEach(() => {
    // injetar secret para instância (usa process.env na construção)
    process.env.PAYMENT_WEBHOOK_SECRET = secret;
    middleware = new SignatureMiddleware();
  });

  it('aceita requisição com assinatura válida', () => {
    const ts = Date.now();
    const req = buildReq({ ok: true }, ts);
    const next = jest.fn();
    middleware.use(req, {} as any, next);
    expect(next).toHaveBeenCalled();
  });

  it('rejeita quando assinatura é inválida', () => {
    const ts = Date.now();
    const req: any = buildReq({ a: 1 }, ts);
    req.header = () => `t=${ts},sig=deadbeef`; // forçar sig errada
    const next = jest.fn();
    expect(() => middleware.use(req, {} as any, next)).toThrow(
      UnauthorizedException,
    );
  });

  it('rejeita quando timestamp está expirado', () => {
    const oldTs = Date.now() - 10 * 60 * 1000; // 10 min atrás
    const req = buildReq({ a: 1 }, oldTs);
    const next = jest.fn();
    expect(() => middleware.use(req, {} as any, next)).toThrow(
      UnauthorizedException,
    );
  });

  it('ignora rotas diferentes', () => {
    const ts = Date.now();
    const req: any = buildReq({ a: 1 }, ts);
    req.originalUrl = '/health';
    const next = jest.fn();
    middleware.use(req, {} as any, next);
    expect(next).toHaveBeenCalled();
  });

  it('ignora métodos diferentes de POST', () => {
    const ts = Date.now();
    const req: any = buildReq({ a: 1 }, ts);
    req.method = 'GET';
    const next = jest.fn();
    middleware.use(req, {} as any, next);
    expect(next).toHaveBeenCalled();
  });
});
