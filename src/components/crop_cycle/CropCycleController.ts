import { NextFunction, Request, Response, Router } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import BaseApi from '../BaseApi';
import { CropCycleService } from './CropCycleService';
import { CropCycleAttributes } from '../../database/models/CropCycle';
import ApiError from '../../abstractions/ApiError';

/**
 * CropCycle controller
 */
export default class CropCycleController extends BaseApi {
	private cropCycleFieldService: CropCycleService;
	public basePath: string = 'crop-cycles';

	constructor() {
		super();
		this.cropCycleFieldService = new CropCycleService();
	}

	/**
	 *
	 */
	public register(): Router {
		this.router.get('/', this.getCropCycles.bind(this));
		this.router.post('/', this.createCropCycle.bind(this));
		this.router.get('/:id', this.getCropCycle.bind(this));
		this.router.put('/:id', this.updateCropCycle.bind(this));
		this.router.delete('/:id', this.delete.bind(this));
		return this.router;
	}

	/**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public async getCropCycles(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const cropCycleFields: CropCycleAttributes[] =
				await this.cropCycleFieldService.getAll();
			res.locals.data = cropCycleFields;
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
	public async getCropCycle(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const id = req.params.id;
			const cropCycle: CropCycleAttributes =
				await this.cropCycleFieldService.getById(id);
			res.locals.data = cropCycle;
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
	public async updateCropCycle(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const id = req.params.id;
			const { body } = req;
			const cropCycle: CropCycleAttributes =
				await this.cropCycleFieldService.update(id, body);
			res.locals.data = {
				cropCycle,
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
	public async createCropCycle(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { body } = req;
			const cropCycle: CropCycleAttributes =
				await this.cropCycleFieldService.create(body);
			res.locals.data = {
				cropCycle,
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
			const status: boolean = await this.cropCycleFieldService.delete(id);
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
