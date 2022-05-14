import { HttpStatus, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class HttpsRedirectMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    if (!req.secure) {
      const httpsUrl = `https://${req.hostname}${req.originalUrl}`;
      Logger.debug(httpsUrl);
      res.redirect(HttpStatus.PERMANENT_REDIRECT, httpsUrl);
    } else {
      next();
    }
  }
}
