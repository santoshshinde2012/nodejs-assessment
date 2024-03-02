import { NextFunction, Request, Response, Router } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import BaseApi from '../BaseApi';
import { CropService } from './CropService';
import { CropAttributes } from '../../database/models/Crop';

/**
 * Crop controller
 */
export default class CropController extends BaseApi {
	private cropService: CropService;
	public basePath: string = 'crops';

	constructor() {
		super();
		this.cropService = new CropService();
	}

	/**
	 *
	 */
	public register(): Router {
		this.router.get('/', this.getCrops.bind(this));
		this.router.post('/', this.createCrop.bind(this));
		this.router.get('/:id', this.getCrop.bind(this));
		this.router.put('/:id', this.updateCrop.bind(this));
		this.router.delete('/:id', this.delete.bind(this));
		return this.router;
	}

	/**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public async getCrops(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const enquiries: CropAttributes[] = await this.cropService.getAll();
			res.locals.data = enquiries;
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
	public async getCrop(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const id = req.params.id;
			const crop: CropAttributes = await this.cropService.getById(id);
			res.locals.data = crop;
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
	public async updateCrop(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const id = req.params.id;
			const { body } = req;
			const crop: CropAttributes = await this.cropService.update(
				id,
				body,
			);
			res.locals.data = {
				crop,
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
	public async createCrop(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { body } = req;
			const crop: CropAttributes = await this.cropService.create(body);
			res.locals.data = {
				crop,
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
			const status: boolean = await this.cropService.delete(id);
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
