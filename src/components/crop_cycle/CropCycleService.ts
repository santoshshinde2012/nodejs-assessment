import { StatusCodes } from 'http-status-codes';
import ApiError from '../../abstractions/ApiError';
import {
	CropCycle,
	CropCycleAttributes,
	CropCycleCreationAttributes,
} from '../../database/models/CropCycle';
import { Property } from '../../database/models/Property';
import { Field } from '../../database/models/Field';
import { Crop } from '../../database/models/Crop';
import logger from '../../lib/logger';

export class CropCycleService {
	async getAll(): Promise<CropCycleAttributes[]> {
		try {
			const enquiries = await CropCycle.findAll({
				include: [
					{ model: Crop, as: 'crop', attributes: ['id', 'name'] },
					{
						model: Property,
						as: 'property',
						attributes: ['id', 'name'],
					},
					{ model: Field, as: 'field', attributes: ['id', 'name'] },
				],
			});
			return enquiries;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

	async getById(id: string | number): Promise<CropCycleAttributes> {
		try {
			const cropCycle = await CropCycle.findByPk(id);
			if (!cropCycle) {
				throw new ApiError('CropCycle not found', StatusCodes.NOT_FOUND);
			}
			return cropCycle;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

	async update(
		id: string | number,
		payload: Partial<CropCycleCreationAttributes>,
	): Promise<CropCycleAttributes> {
		try {
			const cropCycle = await CropCycle.findByPk(id);
			if (!cropCycle) {
				throw new ApiError(
					'CropCycle not found',
					StatusCodes.NOT_FOUND,
				);
			}
			const updatedCropCycle = await cropCycle.update(payload);
			return updatedCropCycle;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

	async create(
		payload: CropCycleCreationAttributes,
	): Promise<CropCycleAttributes> {
		try {
			const cropCycle = await CropCycle.create(payload);
			return cropCycle;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

	async delete(id: string | number): Promise<boolean> {
		try {
			const deletedCropCycleCount = await CropCycle.destroy({
				where: { id },
			});

			return !!deletedCropCycleCount;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}
}
