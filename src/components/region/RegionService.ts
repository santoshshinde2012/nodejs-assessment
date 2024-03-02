import { StatusCodes } from 'http-status-codes';
import ApiError from '../../abstractions/ApiError';
import {
	Region,
	RegionAttributes,
	RegionCreationAttributes,
} from '../../database/models/Region';
import logger from '../../lib/logger';

export class RegionService {
	async getAll(): Promise<RegionAttributes[]> {
		try {
			const regions = await Region.findAll({
				include: [
					{
						model: Region,
						as: 'parentRegion',
						attributes: ['id', 'name'],
					},
					{
						model: Region,
						as: 'subRegions',
						attributes: ['id', 'name'],
					},
				],
			});
			return regions;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

	async getById(id: string | number): Promise<RegionAttributes> {
		try {
			const region = await Region.findByPk(id);
			return region;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

	async update(
		id: string | number,
		payload: Partial<RegionCreationAttributes>,
	): Promise<RegionAttributes> {
		try {
			const region = await Region.findByPk(id);
			if (!region) {
				throw new ApiError('Region not found', StatusCodes.NOT_FOUND);
			}
			const updatedRegion = await region.update(payload);
			return updatedRegion;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

	async create(payload: RegionCreationAttributes): Promise<RegionAttributes> {
		try {
			const region = await Region.create(payload);
			return region;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

	async delete(id: string | number): Promise<boolean> {
		try {
			const deletedRegionCount = await Region.destroy({
				where: { id },
			});

			return !!deletedRegionCount;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}
}
