import { CropCycleService } from "../../../../src/components/crop_cycle/CropCycleService";
import { CropCycle, CropCycleAttributes, CropCycleCreationAttributes } from "../../../../src/database/models/CropCycle";
import logger from "../../../../src/lib/logger";
import cropCycles from '../../data/crop_cycles.json';
jest.mock('../../../../src/lib/logger');

describe('CropCycleService', () => {
    let service: CropCycleService;

    beforeAll(() => {
        service = new CropCycleService();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return all cropCycles', async () => {
        const findAll = jest.spyOn(CropCycle, 'findAll');
        const sequelizeCropCycles = cropCycles.map((cropCycle: CropCycleAttributes) => new CropCycle(cropCycle));
        findAll.mockResolvedValueOnce(sequelizeCropCycles);

        const result = await service.getAll();

        expect(result).toEqual(sequelizeCropCycles);
        expect(findAll).toHaveBeenCalled();
    });

    it('should throw error if failed to fetch cropCycles', async () => {
        const error = new Error('Database error');
        const findAll = jest.spyOn(CropCycle, 'findAll');
        findAll.mockRejectedValueOnce(error);
        await expect(service.getAll()).rejects.toThrow(error);
        expect(logger.error).toHaveBeenCalledWith(error);
    });

    it('should return particular cropCycle by id', async () => {
        const [cropCycle] = cropCycles as CropCycleAttributes[];
        const findByPk = jest.spyOn(CropCycle, 'findByPk');
        const sequelizeCropCycle = new CropCycle(cropCycle)
        findByPk.mockResolvedValueOnce(sequelizeCropCycle);

        const result = await service.getById(cropCycle.id);

        expect(result).toEqual(sequelizeCropCycle);
        expect(findByPk).toHaveBeenCalled();
    });

    it('should throw error if failed to fetch empty cropCycle by id', async () => {
        const [cropCycle] = cropCycles as CropCycleAttributes[];
        const error = new Error('CropCycle not found');

        const findByPk = jest.spyOn(CropCycle, 'findByPk');
        findByPk.mockResolvedValueOnce(null);

        await expect(service.getById(cropCycle.id)).rejects.toThrow(error);
        expect(logger.error).toHaveBeenCalledWith(error);
    });


    it('should throw error if failed to fetch cropCycle by id', async () => {
        const [cropCycle] = cropCycles as CropCycleAttributes[];
        const error = new Error('Database error');

        const findByPk = jest.spyOn(CropCycle, 'findByPk');
        findByPk.mockRejectedValueOnce(error);

        await expect(service.getById(cropCycle.id)).rejects.toThrow(error);
        expect(logger.error).toHaveBeenCalledWith(error);
    });

    it('should update cropCycle with valid input', async () => {
        const [cropCycle] = cropCycles as CropCycleAttributes[];
        const findByPk = jest.spyOn(CropCycle, 'findByPk');

        const sequelizeCropCycle = new CropCycle(cropCycle)
        sequelizeCropCycle.update = jest.fn().mockResolvedValueOnce({ ...cropCycle, name: 'Demo' })

        findByPk.mockResolvedValueOnce(sequelizeCropCycle);

        const result = await service.update(cropCycle.id, { name: 'Demo' });

        expect(result.name).toEqual('Demo');
        expect(CropCycle.findByPk).toHaveBeenCalledWith(cropCycle.id);
    });

    it('should throw an error if it fails to update as it failed to find the cropCycle by id', async () => {
        const error = new Error('CropCycle not found');
        const [cropCycle] = cropCycles as CropCycleAttributes[];

        const findByPk = jest.spyOn(CropCycle, 'findByPk');
        findByPk.mockResolvedValueOnce(null);

        await expect(service.update(cropCycle.id, { name: 'Demo' })).rejects.toThrow(error);

        expect(logger.error).toHaveBeenCalledWith(error);
    });


    it('should throw an error if it fails to update', async () => {
         const [cropCycle] = cropCycles as CropCycleAttributes[];
        const error = new Error('Database error');
        const findByPk = jest.spyOn(CropCycle, 'findByPk');

        const sequelizeCropCycle = new CropCycle(cropCycle)
        sequelizeCropCycle.update = jest.fn().mockRejectedValueOnce(error)

        findByPk.mockResolvedValueOnce(sequelizeCropCycle);

        await expect(service.update(cropCycle.id, { name: 'Demo' })).rejects.toThrow(error);
        expect(logger.error).toHaveBeenCalledWith(error);
    });

    it('should create a new cropCycle with valid input', async () => {
        const payload: CropCycleCreationAttributes = {
            id: "2b9eec45-fd45-488c-afb5-e8035e692228",
            name: "CropCycle 1",
            cropId: "71fb275d-da5c-48ea-b625-3ad60c6240df",
            fieldId: null,
            propertyId: "44b7ce74-68d4-4537-93e5-d7bfa3c6d57c",
            plantingDate: "2024-02-29T18:30:00.000Z",
            harvestDate: "2024-06-29T18:30:00.000Z",
        };

        // Mocked cropCycle object returned after creation
        const createdCropCycle: CropCycleAttributes = {
            id: "2b9eec45-fd45-488c-afb5-e8035e692228",
            name: "CropCycle 1",
            cropId: "71fb275d-da5c-48ea-b625-3ad60c6240df",
            fieldId: null,
            propertyId: "44b7ce74-68d4-4537-93e5-d7bfa3c6d57c",
            plantingDate: "2024-02-29T18:30:00.000Z",
            harvestDate: "2024-06-29T18:30:00.000Z",
        };

        const createMock = jest.spyOn(CropCycle, 'create');
        createMock.mockResolvedValueOnce(createdCropCycle);

        const result = await service.create(payload);

        expect(result).toEqual(createdCropCycle);
        expect(createMock).toHaveBeenCalledWith(payload);
    });

    it('should throw error if failed to create cropCycle', async () => {
        const payload: CropCycleCreationAttributes = {
            id: "2b9eec45-fd45-488c-afb5-e8035e692228",
            name: "CropCycle 1",
            cropId: "71fb275d-da5c-48ea-b625-3ad60c6240df",
            fieldId: null,
            propertyId: "44b7ce74-68d4-4537-93e5-d7bfa3c6d57c",
            plantingDate: "2024-02-29T18:30:00.000Z",
            harvestDate: "2024-06-29T18:30:00.000Z",
        };

        const error = new Error('Database error');

        const createMock = jest.spyOn(CropCycle, 'create');
        createMock.mockRejectedValueOnce(error);

        await expect(service.create(payload)).rejects.toThrow(error);
        expect(logger.error).toHaveBeenCalledWith(error);
        expect(createMock).toHaveBeenCalledWith(payload);
    });

    it('should return true if cropCycle is deleted successfully', async () => {
        const id = '1';

        const destroyMock = jest.spyOn(CropCycle, 'destroy');
        destroyMock.mockResolvedValueOnce(1);

        const result = await service.delete(id);

        expect(result).toEqual(true);
        expect(destroyMock).toHaveBeenCalledWith({ where: { id } });
    });

    it('should return false if no cropCycle is deleted', async () => {
        const id = '1';

        const destroyMock = jest.spyOn(CropCycle, 'destroy');
        destroyMock.mockResolvedValueOnce(0);

        const result = await service.delete(id);

        expect(result).toEqual(false);
        expect(destroyMock).toHaveBeenCalledWith({ where: { id } });
    });


    it('should throw error if failed to delete cropCycle', async () => {
        const id = '1';
        const error = new Error('Database error');

        const destroyMock = jest.spyOn(CropCycle, 'destroy');
        destroyMock.mockRejectedValueOnce(error);

        await expect(service.delete(id)).rejects.toThrow(error);
        expect(logger.error).toHaveBeenCalledWith(error);
        expect(destroyMock).toHaveBeenCalledWith({ where: { id } });
    });
});
