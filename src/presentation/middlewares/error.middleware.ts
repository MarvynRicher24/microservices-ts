import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  // si l'erreur est déjà bien formée
  const status = err?.status || 500;
  const message = err?.message || 'Internal Server Error';

  // Option : enrichir pour validation errors, etc.
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: message, details: err.details ?? null });
  }

  res.status(status).json({ error: message });
}
