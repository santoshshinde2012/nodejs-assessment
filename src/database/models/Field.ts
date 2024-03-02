import { DataTypes, Model, Optional, UUIDV4 } from 'sequelize';
import sequelize from '../index';
import { Region } from './Region'; // Import the Region model
import { CropCycle } from './CropCycle';

interface FieldAttributes {
	id: string;
	regionId: string;
	name: string;
	geometry: string | Object;
	area: number;
}

interface FieldCreationAttributes extends Optional<FieldAttributes, 'id'> {}

class Field
	extends Model<FieldAttributes, FieldCreationAttributes>
	implements FieldAttributes
{
	public id!: string;
	public regionId!: string;
	public name!: string;
	public geometry!: any;
	public area!: number;

	// Define associations
	public readonly region?: Region;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

Field.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: UUIDV4,
			primaryKey: true,
		},
		regionId: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: 'Region',
				key: 'id',
			},
		},
		name: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		geometry: {
			type: DataTypes.GEOMETRY('POLYGON', 4326),
			allowNull: false,
		},
		area: {
			type: DataTypes.DOUBLE,
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: 'Field',
		tableName: 'Field',
		timestamps: true,
	},
);

Region.hasMany(Field, { foreignKey: 'regionId', as: 'region' });
CropCycle.belongsTo(Field, { foreignKey: 'fieldId', as: 'field' });

export { Field, FieldAttributes, FieldCreationAttributes };
