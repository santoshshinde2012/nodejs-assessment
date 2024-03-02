import { RegionService } from "../../../../src/components/region/RegionService";
import { Region, RegionAttributes, RegionCreationAttributes } from "../../../../src/database/models/Region";
import logger from "../../../../src/lib/logger";
import regions from '../../data/regions.json';

jest.mock('../../../../src/lib/logger');

describe('RegionService', () => {
    let service: RegionService;

    beforeAll(() => {
        service = new RegionService();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return all regions', async () => {
        const findAll = jest.spyOn(Region, 'findAll');
        const sequelizeRegions = regions.map((region: RegionAttributes) => new Region(region));
        findAll.mockResolvedValueOnce(sequelizeRegions);

        const result = await service.getAll();

        expect(result).toEqual(sequelizeRegions);
        expect(findAll).toHaveBeenCalled();
    });

    it('should throw error if failed to fetch regions', async () => {
        const error = new Error('Database error');
        const findAll = jest.spyOn(Region, 'findAll');
        findAll.mockRejectedValueOnce(error);
        await expect(service.getAll()).rejects.toThrow(error);
        expect(logger.error).toHaveBeenCalledWith(error);
    });


    it('should return particular region by id', async () => {
        const [region] = regions as RegionAttributes[];
        const findByPk = jest.spyOn(Region, 'findByPk');
        const sequelizeRegion = new Region(region)
        findByPk.mockResolvedValueOnce(sequelizeRegion);

        const result = await service.getById(region.id);

        expect(result).toEqual(sequelizeRegion);
        expect(findByPk).toHaveBeenCalled();
    });

    it('should throw error if failed to fetch region by id', async () => {
        const [region] = regions as RegionAttributes[];
        const error = new Error('Database error');

        const findByPk = jest.spyOn(Region, 'findByPk');
        findByPk.mockRejectedValueOnce(error);

        await expect(service.getById(region.id)).rejects.toThrow(error);
        expect(logger.error).toHaveBeenCalledWith(error);
    });

    it('should update region with valid input', async () => {
        const [region] = regions as RegionAttributes[];
        const findByPk = jest.spyOn(Region, 'findByPk');

        const sequelizeRegion = new Region(region)
        sequelizeRegion.update = jest.fn().mockResolvedValueOnce({ ...region, name: 'Demo' })

        findByPk.mockResolvedValueOnce(sequelizeRegion);

        const result = await service.update(region.id, { name: 'Demo' });

        expect(result.name).toEqual('Demo');
        expect(Region.findByPk).toHaveBeenCalledWith(region.id);
    });

    it('should throw an error if it fails to update as it failed to find the region by id', async () => {
        const error = new Error('Region not found');
        const [region] = regions as RegionAttributes[];

        const findByPk = jest.spyOn(Region, 'findByPk');
        findByPk.mockResolvedValueOnce(null);

        await expect(service.update(region.id, { name: 'Demo' })).rejects.toThrow(error);

        expect(logger.error).toHaveBeenCalledWith(error);
    });


    it('should throw an error if it fails to update', async () => {
         const [region] = regions as RegionAttributes[];
        const error = new Error('Database error');
        const findByPk = jest.spyOn(Region, 'findByPk');

        const sequelizeRegion = new Region(region)
        sequelizeRegion.update = jest.fn().mockRejectedValueOnce(error)

        findByPk.mockResolvedValueOnce(sequelizeRegion);

        await expect(service.update(region.id, { name: 'Demo' })).rejects.toThrow(error);
        expect(logger.error).toHaveBeenCalledWith(error);
    });

    it('should create a new region with valid input', async () => {
        const payload: RegionCreationAttributes = {
            id: "2b9eec45-fd45-488c-afb5-e8035e692228",
            propertyId: "2b9eec45-fd45-488c-afb5-e8035e692228",
            name: "Region 1",
            area: 10,
            geometry: {
                "coordinates": [-75.3372987731628, 45.383321536272049]
            }
        };

        const createdRegion: RegionAttributes = {
            id: "2b9eec45-fd45-488c-afb5-e8035e692228",
            propertyId: "2b9eec45-fd45-488c-afb5-e8035e692228",
            name: "Region 1",
            area: 10,
            geometry: {
                "coordinates": [-75.3372987731628, 45.383321536272049]
            }
        };

        const createMock = jest.spyOn(Region, 'create');
        createMock.mockResolvedValueOnce(createdRegion);

        const result = await service.create(payload);

        expect(result).toEqual(createdRegion);
        expect(createMock).toHaveBeenCalledWith(payload);
    });

    it('should throw error if failed to create region', async () => {
        const payload: RegionCreationAttributes = {
            id: "2b9eec45-fd45-488c-afb5-e8035e692228",
            propertyId: "2b9eec45-fd45-488c-afb5-e8035e692228",
            name: "Region 1",
            area: 10,
            geometry: {
                "coordinates": [-75.3372987731628, 45.383321536272049]
            }
        };

        const error = new Error('Database error');

        const createMock = jest.spyOn(Region, 'create');
        createMock.mockRejectedValueOnce(error);

        await expect(service.create(payload)).rejects.toThrow(error);
        expect(logger.error).toHaveBeenCalledWith(error);
        expect(createMock).toHaveBeenCalledWith(payload);
    });

    it('should return true if region is deleted successfully', async () => {
        const id = '1';

        const destroyMock = jest.spyOn(Region, 'destroy');
        destroyMock.mockResolvedValueOnce(1);

        const result = await service.delete(id);

        expect(result).toEqual(true);
        expect(destroyMock).toHaveBeenCalledWith({ where: { id } });
    });

    it('should return false if no region is deleted', async () => {
        const id = '1';

        const destroyMock = jest.spyOn(Region, 'destroy');
        destroyMock.mockResolvedValueOnce(0);

        const result = await service.delete(id);

        expect(result).toEqual(false);
        expect(destroyMock).toHaveBeenCalledWith({ where: { id } });
    });


    it('should throw error if failed to delete region', async () => {
        const id = '1';
        const error = new Error('Database error');

        const destroyMock = jest.spyOn(Region, 'destroy');
        destroyMock.mockRejectedValueOnce(error);

        await expect(service.delete(id)).rejects.toThrow(error);
        expect(logger.error).toHaveBeenCalledWith(error);
        expect(destroyMock).toHaveBeenCalledWith({ where: { id } });
    });

});
