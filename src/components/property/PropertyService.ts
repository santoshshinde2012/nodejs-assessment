import { StatusCodes } from 'http-status-codes';
import ApiError from '../../abstractions/ApiError';
import {
	Property,
	PropertyAttributes,
	PropertyCreationAttributes,
} from '../../database/models/Property';
import { Organization } from '../../database/models/Organization';
import logger from '../../lib/logger';

interface Query {
	organizationId?: number | string;
}

export class PropertyService {
	async query<QueryType extends Query>(
		reqQuery: QueryType,
	): Promise<PropertyAttributes[]> {
		try {
			const query: Query = {};
			const { organizationId } = reqQuery;
			if (organizationId) {
				query.organizationId = organizationId;
			}
			const properties = await Property.findAll({
				where: {
					...query,
				},
			});
			return properties;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

	async getAll(): Promise<PropertyAttributes[]> {
		try {
			const properties = await Property.findAll({
				include: [
					{
						model: Organization,
						as: 'organization',
						attributes: ['id', 'name'],
					},
				],
			});
			return properties;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

	async getById(id: string | number): Promise<PropertyAttributes> {
		try {
			const property = await Property.findByPk(id, {
				include: [
					{
						model: Organization,
						as: 'organization',
						attributes: ['id', 'name'],
					},
				],
			});
			return property;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

	async update(
		id: string | number,
		payload: Partial<PropertyCreationAttributes>,
	): Promise<PropertyAttributes> {
		try {
			const property = await Property.findByPk(id);
			if (!property) {
				throw new ApiError('Property not found', StatusCodes.NOT_FOUND);
			}
			const updatedProperty = await property.update(payload);
			return updatedProperty;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

	async create(
		payload: PropertyCreationAttributes,
	): Promise<PropertyAttributes> {
		try {
			const property = await Property.create(payload);
			return property;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

	async delete(id: string | number): Promise<boolean> {
		try {
			const deletedPropertyCount = await Property.destroy({
				where: { id },
			});

			return !!deletedPropertyCount;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}
}
