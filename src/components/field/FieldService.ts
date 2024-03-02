import { StatusCodes } from 'http-status-codes';
import ApiError from '../../abstractions/ApiError';
import {
	Field,
	FieldAttributes,
	FieldCreationAttributes,
} from '../../database/models/Field';
import logger from '../../lib/logger';

export class FieldService {
	async getAll(): Promise<FieldAttributes[]> {
		try {
			const fields = await Field.findAll();
			return fields;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

	async getById(id: string | number): Promise<FieldAttributes> {
		try {
			const field = await Field.findByPk(id);
			return field;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

	async update(
		id: string | number,
		payload: Partial<FieldCreationAttributes>,
	): Promise<FieldAttributes> {
		try {
			const field = await Field.findByPk(id);
			if (!field) {
				throw new ApiError('Field not found', StatusCodes.NOT_FOUND);
			}
			const updatedField = await field.update(payload);
			return updatedField;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

	async create(payload: FieldCreationAttributes): Promise<FieldAttributes> {
		try {
			const field = await Field.create(payload);
			return field;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

	async delete(id: string | number): Promise<boolean> {
		try {
			const deletedFieldCount = await Field.destroy({
				where: { id },
			});

			return !!deletedFieldCount;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}
}
