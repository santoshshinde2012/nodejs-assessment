import { DataTypes, Model, Optional, UUIDV4 } from 'sequelize';
import sequelize from '../index';
import { CropCycle } from './CropCycle';

interface PropertyAttributes {
	id: string;
	organizationId: string;
	name: string;
}

interface PropertyCreationAttributes
	extends Optional<PropertyAttributes, 'id'> {}

class Property
	extends Model<PropertyAttributes, PropertyCreationAttributes>
	implements PropertyAttributes
{
	public id!: string;
	public organizationId!: string;
	public name!: string;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

Property.init(
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
		organizationId: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: 'Organization',
				key: 'id',
			},
		},
	},
	{
		sequelize,
		modelName: 'Property',
		tableName: 'Property',
		timestamps: true,
	},
);

CropCycle.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' });

export { Property, PropertyAttributes, PropertyCreationAttributes };
