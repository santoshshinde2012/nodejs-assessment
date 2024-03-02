import { DataTypes, Model, Optional, UUIDV4 } from 'sequelize';
import sequelize from '../index';

interface RegionAttributes {
	id: string;
	propertyId: string;
	parentRegionId?: string | null;
	name: string;
	geometry: string | Object;
	area: number;
}

interface RegionCreationAttributes extends Optional<RegionAttributes, 'id'> {}

class Region
	extends Model<RegionAttributes, RegionCreationAttributes>
	implements RegionAttributes
{
	public id!: string;
	public propertyId!: string;
	public parentRegionId!: string | null;
	public name!: string;
	public geometry!: string;
	public area!: number;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

Region.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: UUIDV4,
			primaryKey: true,
		},
		propertyId: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: 'Property',
				key: 'id',
			},
		},
		parentRegionId: {
			type: DataTypes.UUID,
			allowNull: true,
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
		modelName: 'Region',
		tableName: 'Region',
		timestamps: true,
	},
);

Region.hasMany(Region, { as: 'subRegions', foreignKey: 'parentRegionId' });
Region.belongsTo(Region, { as: 'parentRegion', foreignKey: 'parentRegionId' });

export { Region, RegionAttributes, RegionCreationAttributes };
