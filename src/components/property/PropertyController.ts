import { NextFunction, Request, Response, Router } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import BaseApi from '../BaseApi';
import { PropertyService } from './PropertyService';
import { PropertyAttributes } from '../../database/models/Property';

/**
 * Property controller
 */
export default class PropertyController extends BaseApi {
	private propertyService: PropertyService;
	public basePath: string = 'properties';

	constructor() {
		super();
		this.propertyService = new PropertyService();
	}

	/**
	 *
	 */
	public register(): Router {
		this.router.get('/', this.getProperties.bind(this));
		this.router.post('/', this.createProperty.bind(this));
		this.router.get('/:id', this.getProperty.bind(this));
		this.router.put('/:id', this.updateProperty.bind(this));
		this.router.delete('/:id', this.delete.bind(this));
		return this.router;
	}

	/**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public async getProperties(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const properties: PropertyAttributes[] =
				await this.propertyService.getAll();
			res.locals.data = properties;
			// call base class method
			super.send(res);
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
	public async getProperty(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const id = req.params.id;
			const property: PropertyAttributes =
				await this.propertyService.getById(id);
			res.locals.data = property;
			// call base class method
			super.send(res);
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
	public async updateProperty(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const id = req.params.id;
			const { body } = req;
			const property: PropertyAttributes =
				await this.propertyService.update(id, body);
			res.locals.data = {
				property,
			};
			// call base class method
			super.send(res);
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
	public async createProperty(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { body } = req;
			const property: PropertyAttributes =
				await this.propertyService.create(body);
			res.locals.data = {
				property,
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
			const status: boolean = await this.propertyService.delete(id);
			res.locals.data = {
				status,
			};
			// call base class method
			super.send(res);
		} catch (err) {
			next(err);
		}
	}
}
