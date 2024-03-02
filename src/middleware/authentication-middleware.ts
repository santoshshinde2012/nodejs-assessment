import { Request, Response, NextFunction } from 'express';

export function isAuthenticated(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.redirect('/login/github');
	}
}
