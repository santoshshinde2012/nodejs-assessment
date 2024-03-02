import { DataTypes, Model, Optional, UUIDV4 } from 'sequelize';
import sequelize from '../index';
import { CropCycle } from './CropCycle';

// Enum for Crop Types
enum CropType {
	Grain = 'Grain',
	Fruit = 'Fruit',
	Vegetable = 'Vegetable',
	Legume = 'Legume',
	Herb = 'Herb',
	Root = 'Root',
	Tuber = 'Tuber',
	Oilseed = 'Oilseed',
	Spice = 'Spice',
	Beverage = 'Beverage',
	Industrial = 'Industrial',
	Other = 'Other',
}

interface CropAttributes {
	id: string;
	name: string;
	type: string | CropType;
}

interface CropCreationAttributes extends Optional<CropAttributes, 'id'> {}

class Crop
	extends Model<CropAttributes, CropCreationAttributes>
	implements CropAttributes
{
	public id!: string;
	public name!: string;
	public type!: CropType;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

Crop.init(
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
		type: {
			type: DataTypes.ENUM(...Object.values(CropType)),
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: 'Crop',
		tableName: 'Crop',
		timestamps: true,
	},
);

CropCycle.belongsTo(Crop, { foreignKey: 'cropId', as: 'crop' });

export { Crop, CropType, CropAttributes, CropCreationAttributes };
