import { NextFunction, Request, Response, Router } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import BaseApi from '../BaseApi';
import { FieldService } from './FieldService';
import { FieldAttributes } from '../../database/models/Field';
import ApiError from '../../abstractions/ApiError';

/**
 * Field controller
 */
export default class FieldController extends BaseApi {
	private fieldService: FieldService;
	public basePath: string = 'fields';

	constructor() {
		super();
		this.fieldService = new FieldService();
	}

	/**
	 *
	 */
	public register(): Router {
		this.router.get('/', this.getFields.bind(this));
		this.router.post('/', this.createField.bind(this));
		this.router.get('/:id', this.getField.bind(this));
		this.router.put('/:id', this.updateField.bind(this));
		this.router.delete('/:id', this.delete.bind(this));
		return this.router;
	}

	/**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public async getFields(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const fields: FieldAttributes[] = await this.fieldService.getAll();
			res.locals.data = fields;
			// call base class method
			this.send(res);
		} catch (err) {
			next(err);
		}
	}

	/**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public async getField(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const id = req.params.id;
			const field: FieldAttributes = await this.fieldService.getById(id);
			res.locals.data = field;
			// call base class method
			this.send(res);
		} catch (err) {
			next(err);
		}
	}

	/**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public async updateField(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const id = req.params.id;
			const { body } = req;
			const field: FieldAttributes = await this.fieldService.update(
				id,
				body,
			);
			res.locals.data = {
				field,
			};
			// call base class method
			this.send(res);
		} catch (err) {
			next(err);
		}
	}

	/**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public async createField(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { body } = req;
			const field: FieldAttributes = await this.fieldService.create(body);
			res.locals.data = {
				field,
			};
			// call base class method
			super.send(res, StatusCodes.CREATED);
		} catch (err) {
			next(err);
		}
	}

	/**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public async delete(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const id = req.params.id;
			const status: boolean = await this.fieldService.delete(id);
			res.locals.data = {
				status,
			};
			// call base class method
			this.send(res);
		} catch (err) {
			next(err);
		}
	}
}
