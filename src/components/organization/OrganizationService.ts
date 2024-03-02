import {
	Organization,
	OrganizationAttributes,
	OrganizationCreationAttributes,
} from '../../database/models/Organization';
import CommonService from '../../services/CommonService';
import { PropertyAttributes } from '../../database/models/Property';
import logger from '../../lib/logger';
import ApiError from '../../abstractions/ApiError';
import { StatusCodes } from 'http-status-codes';

export class OrganizationService {
	private commonService: CommonService;

	constructor() {
		this.commonService = new CommonService();
	}

	async getAll(): Promise<OrganizationAttributes[]> {
		try {
			const organizations = await Organization.findAll();
			return organizations;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

	async getById(id: string | number): Promise<OrganizationAttributes> {
		try {
			const organization = await Organization.findByPk(id);
			return organization;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

	async update(
		id: string | number,
		payload: Partial<OrganizationCreationAttributes>,
	): Promise<OrganizationAttributes> {
		try {
			const organization = await Organization.findByPk(id);
			if (!organization) {
				throw new ApiError(
					'Organization not found',
					StatusCodes.NOT_FOUND,
				);
			}
			const updatedOrganization = await organization.update(payload);
			return updatedOrganization;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

	async create(
		payload: OrganizationCreationAttributes,
	): Promise<OrganizationAttributes> {
		try {
			const organization = await Organization.create(payload);
			return organization;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

	async delete(id: string | number): Promise<boolean> {
		try {
			const deletedOrganizationCount = await Organization.destroy({
				where: { id },
			});

			return !!deletedOrganizationCount;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

	async getPropertiesByOrganizationId(
		id: number | string,
	): Promise<PropertyAttributes[]> {
		try {
			const properties: PropertyAttributes[] =
				await this.commonService.getPropertiesByOrganizationId(id);
			return properties;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}
}
