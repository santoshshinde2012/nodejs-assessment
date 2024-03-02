import { DataTypes, Model, Optional, UUIDV4 } from 'sequelize';
import sequelize from '../index';
import { Property } from './Property';

interface OrganizationAttributes {
	id: string;
	name: string;
	country: string;
}

interface OrganizationCreationAttributes
	extends Optional<OrganizationAttributes, 'id'> {}

class Organization
	extends Model<OrganizationAttributes, OrganizationCreationAttributes>
	implements OrganizationAttributes
{
	public id!: string;
	public name!: string;
	public country!: string;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

Organization.init(
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
		country: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: 'Organization',
		tableName: 'Organization',
		timestamps: true,
	},
);

Property.belongsTo(Organization, {
	foreignKey: 'organizationId',
	as: 'organization',
});

export { Organization, OrganizationAttributes, OrganizationCreationAttributes };
