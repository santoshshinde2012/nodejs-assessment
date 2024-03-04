import { NextFunction, Request, Response, Router } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import BaseApi from '../BaseApi';
import { RegionService } from './RegionService';
import { RegionAttributes } from '../../database/models/Region';
import ApiError from '../../abstractions/ApiError';

/**
 * Region controller
 */
export default class RegionController extends BaseApi {
	private regionService: RegionService;
	public basePath: string = 'regions';

	constructor() {
		super();
		this.regionService = new RegionService();
	}

	/**
	 *
	 */
	public register(): Router {
		this.router.get('/', this.getRegions.bind(this));
		this.router.get('/:id', this.getRegion.bind(this));
		this.router.post('/', this.createRegion.bind(this));
		this.router.put('/:id', this.updateRegion.bind(this));
		this.router.delete('/:id', this.delete.bind(this));
		return this.router;
	}

	/**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public async getRegions(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const regions: RegionAttributes[] =
				await this.regionService.getAll();
			res.locals.data = regions;
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
	public async getRegion(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const id = req.params.id;
			const region: RegionAttributes =
				await this.regionService.getById(id);
			res.locals.data = region;
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
	public async updateRegion(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const id = req.params.id;
			const { body } = req;
			const region: RegionAttributes = await this.regionService.update(
				id,
				body,
			);
			res.locals.data = {
				region,
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
	public async createRegion(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { body } = req;
			const region: RegionAttributes =
				await this.regionService.create(body);
			res.locals.data = {
				region,
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
			const status: boolean = await this.regionService.delete(id);
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
