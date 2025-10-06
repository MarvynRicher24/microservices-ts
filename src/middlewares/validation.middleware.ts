import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const userCreateValidation = [
  body('firstName').isString().notEmpty(),
  body('lastName').isString().notEmpty(),
  body('email').isEmail(),
  body('phone').optional().isMobilePhone('any'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    next();
  }
];

export const userUpdateValidation = [
  body('firstName').optional().isString(),
  body('lastName').optional().isString(),
  body('email').optional().isEmail(),
  body('phone').optional().isMobilePhone('any'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    next();
  }
];
