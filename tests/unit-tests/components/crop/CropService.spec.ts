import { CropService } from "../../../../src/components/crop/CropService";
import { Crop, CropAttributes, CropCreationAttributes } from "../../../../src/database/models/Crop";
import logger from "../../../../src/lib/logger";
import crops from '../../data/crops.json';
jest.mock('../../../../src/lib/logger');

describe('CropService', () => {
    let service: CropService;

    beforeAll(() => {
        service = new CropService();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return all crops', async () => {
        const findAll = jest.spyOn(Crop, 'findAll');
        const sequelizeCrops = crops.map((org: CropAttributes) => new Crop(org));
        findAll.mockResolvedValueOnce(sequelizeCrops);

        const result = await service.getAll();

        expect(result).toEqual(sequelizeCrops);
        expect(findAll).toHaveBeenCalled();
    });

    it('should throw error if failed to fetch crops', async () => {
        const error = new Error('Database error');
        const findAll = jest.spyOn(Crop, 'findAll');
        findAll.mockRejectedValueOnce(error);
        await expect(service.getAll()).rejects.toThrow(error);
        expect(logger.error).toHaveBeenCalledWith(error);
    });

    it('should return particular crop by id', async () => {
        const [crop] = crops as CropAttributes[];
        const findByPk = jest.spyOn(Crop, 'findByPk');
        const sequelizeCrop = new Crop(crop)
        findByPk.mockResolvedValueOnce(sequelizeCrop);

        const result = await service.getById(crop.id);

        expect(result).toEqual(sequelizeCrop);
        expect(findByPk).toHaveBeenCalled();
    });

    it('should throw error if failed to fetch empty crop by id', async () => {
        const [crop] = crops as CropAttributes[];
        const error = new Error('Crop not found');

        const findByPk = jest.spyOn(Crop, 'findByPk');
        findByPk.mockResolvedValueOnce(null);

        await expect(service.getById(crop.id)).rejects.toThrow(error);
        expect(logger.error).toHaveBeenCalledWith(error);
    });


    it('should throw error if failed to fetch crop by id', async () => {
        const [crop] = crops as CropAttributes[];
        const error = new Error('Database error');

        const findByPk = jest.spyOn(Crop, 'findByPk');
        findByPk.mockRejectedValueOnce(error);

        await expect(service.getById(crop.id)).rejects.toThrow(error);
        expect(logger.error).toHaveBeenCalledWith(error);
    });

    it('should update crop with valid input', async () => {
        const [crop] = crops as CropAttributes[];
        const findByPk = jest.spyOn(Crop, 'findByPk');

        const sequelizeCrop = new Crop(crop)
        sequelizeCrop.update = jest.fn().mockResolvedValueOnce({ ...crop, name: 'Demo' })

        findByPk.mockResolvedValueOnce(sequelizeCrop);

        const result = await service.update(crop.id, { name: 'Demo' });

        expect(result.name).toEqual('Demo');
        expect(Crop.findByPk).toHaveBeenCalledWith(crop.id);
    });

    it('should throw an error if it fails to update as it failed to find the crop by id', async () => {
        const error = new Error('Crop not found');
        const [crop] = crops as CropAttributes[];

        const findByPk = jest.spyOn(Crop, 'findByPk');
        findByPk.mockResolvedValueOnce(null);

        await expect(service.update(crop.id, { name: 'Demo' })).rejects.toThrow(error);

        expect(logger.error).toHaveBeenCalledWith(error);
    });


    it('should throw an error if it fails to update', async () => {
         const [crop] = crops as CropAttributes[];
        const error = new Error('Database error');
        const findByPk = jest.spyOn(Crop, 'findByPk');

        const sequelizeCrop = new Crop(crop)
        sequelizeCrop.update = jest.fn().mockRejectedValueOnce(error)

        findByPk.mockResolvedValueOnce(sequelizeCrop);

        await expect(service.update(crop.id, { name: 'Demo' })).rejects.toThrow(error);
        expect(logger.error).toHaveBeenCalledWith(error);
    });

    it('should create a new crop with valid input', async () => {
        const payload: CropCreationAttributes = {
            id: "2b9eec45-fd45-488c-afb5-e8035e692228",
            name: "Crop 1",
            type: "Grain",
        };

        // Mocked crop object returned after creation
        const createdCrop: CropAttributes = {
            id: "2b9eec45-fd45-488c-afb5-e8035e692228",
            name: "Crop 1",
            type: "Grain",
        };

        const createMock = jest.spyOn(Crop, 'create');
        createMock.mockResolvedValueOnce(createdCrop);

        const result = await service.create(payload);

        expect(result).toEqual(createdCrop);
        expect(createMock).toHaveBeenCalledWith(payload);
    });

    it('should throw error if failed to create crop', async () => {
        const payload: CropCreationAttributes = {
            id: "2b9eec45-fd45-488c-afb5-e8035e692228",
            name: "Crop 1",
            type: "Grain",
        };

        const error = new Error('Database error');

        const createMock = jest.spyOn(Crop, 'create');
        createMock.mockRejectedValueOnce(error);

        await expect(service.create(payload)).rejects.toThrow(error);
        expect(logger.error).toHaveBeenCalledWith(error);
        expect(createMock).toHaveBeenCalledWith(payload);
    });

    it('should return true if crop is deleted successfully', async () => {
        const id = '1';

        const destroyMock = jest.spyOn(Crop, 'destroy');
        destroyMock.mockResolvedValueOnce(1);

        const result = await service.delete(id);

        expect(result).toEqual(true);
        expect(destroyMock).toHaveBeenCalledWith({ where: { id } });
    });

    it('should return false if no crop is deleted', async () => {
        const id = '1';

        const destroyMock = jest.spyOn(Crop, 'destroy');
        destroyMock.mockResolvedValueOnce(0);

        const result = await service.delete(id);

        expect(result).toEqual(false);
        expect(destroyMock).toHaveBeenCalledWith({ where: { id } });
    });


    it('should throw error if failed to delete crop', async () => {
        const id = '1';
        const error = new Error('Database error');

        const destroyMock = jest.spyOn(Crop, 'destroy');
        destroyMock.mockRejectedValueOnce(error);

        await expect(service.delete(id)).rejects.toThrow(error);
        expect(logger.error).toHaveBeenCalledWith(error);
        expect(destroyMock).toHaveBeenCalledWith({ where: { id } });
    });
});
