import { StatusCodes } from 'http-status-codes';
import ApiError from '../../abstractions/ApiError';
import {
	Crop,
	CropAttributes,
	CropCreationAttributes,
} from '../../database/models/Crop';
import logger from '../../lib/logger';

export class CropService {
	async getAll(): Promise<CropAttributes[]> {
		try {
			const crops = await Crop.findAll();
			return crops;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

	async getById(id: string | number): Promise<CropAttributes> {
		try {
			const crop = await Crop.findByPk(id);
			if (!crop) {
				throw new ApiError('Crop not found', StatusCodes.NOT_FOUND);
			}
			return crop;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

	async update(
		id: string | number,
		payload: Partial<CropCreationAttributes>,
	): Promise<CropAttributes> {
		try {
			const crop = await Crop.findByPk(id);
			if (!crop) {
				throw new ApiError('Crop not found', StatusCodes.NOT_FOUND);
			}
			const updatedCrop = await crop.update(payload);
			return updatedCrop;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

	async create(payload: CropCreationAttributes): Promise<CropAttributes> {
		try {
			const crop = await Crop.create(payload);
			return crop;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

	async delete(id: string | number): Promise<boolean> {
		try {
			const deletedCropCount = await Crop.destroy({
				where: { id },
			});

			return !!deletedCropCount;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}
}
