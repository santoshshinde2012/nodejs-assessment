import { NextFunction, Request, Response, Router } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import BaseApi from '../BaseApi';
import { OrganizationService } from './OrganizationService';
import { OrganizationAttributes } from '../../database/models/Organization';
import { PropertyAttributes } from '../../database/models/Property';
import ApiError from '../../abstractions/ApiError';

/**
 * Organization controller
 */
export default class OrganizationController extends BaseApi {
	private organizationService: OrganizationService;
	public basePath: string = 'organizations';

	constructor() {
		super();
		this.organizationService = new OrganizationService();
	}

	/**
	 *
	 */
	public register(): Router {
		this.router.get('/', this.getOrganizations.bind(this));
		this.router.post('/', this.createOrganization.bind(this));
		this.router.get('/:id', this.getOrganization.bind(this));
		this.router.put('/:id', this.updateOrganization.bind(this));
		this.router.delete('/:id', this.delete.bind(this));

		this.router.get(
			'/:id/properties',
			this.getPropertiesByOrganizationId.bind(this),
		);

		return this.router;
	}

	/**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public async getOrganizations(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const organizations: OrganizationAttributes[] =
				await this.organizationService.getAll();
			res.locals.data = organizations;
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
	public async getOrganization(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const id = req.params.id;
			const organization: OrganizationAttributes =
				await this.organizationService.getById(id);
			res.locals.data = organization;
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
	public async updateOrganization(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const id = req.params.id;
			const { body } = req;
			const organization: OrganizationAttributes =
				await this.organizationService.update(id, body);
			res.locals.data = {
				organization,
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
	public async createOrganization(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { name, country } = req.body;
			if (!name && !country) {
				throw new ApiError(
					ReasonPhrases.BAD_REQUEST,
					StatusCodes.BAD_REQUEST,
				);
			}
			const organization: OrganizationAttributes =
				await this.organizationService.create({ name, country });
			res.locals.data = {
				organization,
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
			const status: boolean = await this.organizationService.delete(id);
			res.locals.data = {
				status,
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
	public async getPropertiesByOrganizationId(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const id = req.params.id;
			const properties: PropertyAttributes[] =
				await this.organizationService.getPropertiesByOrganizationId(
					id,
				);
			res.locals.data = {
				properties,
			};
			// call base class method
			this.send(res);
		} catch (err) {
			next(err);
		}
	}
}
