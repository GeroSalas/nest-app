import { Request, Response, NextFunction } from 'express';
import { isEmpty } from 'lodash';

export function requestInfoLogger(req: Request, res: Response, next: NextFunction): void {
  const isoDate = new Date().toISOString();
  let requestInfo = `${isoDate} by ${req.ip} requesting at: ${req.method} ...${req.originalUrl}`;
  if (!isEmpty(req.body)) {
    const plainBody = { ...req.body };
    if (plainBody.password) {
      plainBody.password = '********';
    }
    requestInfo += `\n Body: ${JSON.stringify(plainBody)}`;
  }
  console.info(requestInfo);
  next();
}
