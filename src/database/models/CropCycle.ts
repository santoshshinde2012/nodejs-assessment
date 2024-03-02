import { DataTypes, Model, Optional, UUIDV4 } from 'sequelize';
import sequelize from '../index';

interface CropCycleAttributes {
	id: string;
	name: string;
	cropId: string;
	fieldId?: string | null;
	propertyId?: string | null;
	plantingDate: Date | string;
	harvestDate: Date | string;
}

interface CropCycleCreationAttributes
	extends Optional<CropCycleAttributes, 'id'> {}

class CropCycle
	extends Model<CropCycleAttributes, CropCycleCreationAttributes>
	implements CropCycleAttributes
{
	public id!: string;
	public name!: string;
	public cropId!: string;
	public propertyId!: string;
	public fieldId!: string;
	public plantingDate!: Date;
	public harvestDate!: Date;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

CropCycle.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: UUIDV4,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		cropId: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: 'Crop',
				key: 'id',
			},
		},
		fieldId: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'Field',
				key: 'id',
			},
		},
		propertyId: {
			type: DataTypes.UUID,
			allowNull: true,
			references: {
				model: 'Property',
				key: 'id',
			},
		},
		plantingDate: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		harvestDate: {
			type: DataTypes.DATE,
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: 'CropCycle',
		tableName: 'CropCycle',
		timestamps: true,
		hooks: {
			beforeValidate: async (cropCycle: CropCycle) => {
				// Check if both fieldId and propertyId are null or both are not null
				if (
					(cropCycle.fieldId === null &&
						cropCycle.propertyId === null) ||
					(cropCycle.fieldId !== null &&
						cropCycle.propertyId !== null)
				) {
					throw new Error(
						'Either fieldId or propertyId must be provided',
					);
				}
			},
		},
	},
);

export { CropCycle, CropCycleAttributes, CropCycleCreationAttributes };
