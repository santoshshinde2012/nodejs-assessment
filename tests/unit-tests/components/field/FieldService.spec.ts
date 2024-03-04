import { FieldService } from "../../../../src/components/field/FieldService";
import { Field, FieldAttributes, FieldCreationAttributes } from "../../../../src/database/models/Field";
import logger from "../../../../src/lib/logger";
import fields from '../../data/fields.json';

jest.mock('../../../../src/lib/logger');

describe('FieldService', () => {
    let service: FieldService;

    beforeAll(() => {
        service = new FieldService();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return all fields', async () => {
        const findAll = jest.spyOn(Field, 'findAll');
        const sequelizeFields = fields.map((field: FieldAttributes) => new Field(field));
        findAll.mockResolvedValueOnce(sequelizeFields);

        const result = await service.getAll();

        expect(result).toEqual(sequelizeFields);
        expect(findAll).toHaveBeenCalled();
    });

    it('should throw error if failed to fetch fields', async () => {
        const error = new Error('Database error');
        const findAll = jest.spyOn(Field, 'findAll');
        findAll.mockRejectedValueOnce(error);
        await expect(service.getAll()).rejects.toThrow(error);
        expect(logger.error).toHaveBeenCalledWith(error);
    });


    it('should return particular field by id', async () => {
        const [field] = fields as FieldAttributes[];
        const findByPk = jest.spyOn(Field, 'findByPk');
        const sequelizeField = new Field(field)
        findByPk.mockResolvedValueOnce(sequelizeField);

        const result = await service.getById(field.id);

        expect(result).toEqual(sequelizeField);
        expect(findByPk).toHaveBeenCalled();
    });

    it('should throw error if failed to fetch empty field by id', async () => {
        const [field] = fields as FieldAttributes[];
        const error = new Error('Field not found');

        const findByPk = jest.spyOn(Field, 'findByPk');
        findByPk.mockResolvedValueOnce(null);

        await expect(service.getById(field.id)).rejects.toThrow(error);
        expect(logger.error).toHaveBeenCalledWith(error);
    });

    it('should throw error if failed to fetch field by id', async () => {
        const [field] = fields as FieldAttributes[];
        const error = new Error('Database error');

        const findByPk = jest.spyOn(Field, 'findByPk');
        findByPk.mockRejectedValueOnce(error);

        await expect(service.getById(field.id)).rejects.toThrow(error);
        expect(logger.error).toHaveBeenCalledWith(error);
    });

    it('should update field with valid input', async () => {
        const [field] = fields as FieldAttributes[];
        const findByPk = jest.spyOn(Field, 'findByPk');

        const sequelizeField = new Field(field)
        sequelizeField.update = jest.fn().mockResolvedValueOnce({ ...field, name: 'Demo' })

        findByPk.mockResolvedValueOnce(sequelizeField);

        const result = await service.update(field.id, { name: 'Demo' });

        expect(result.name).toEqual('Demo');
        expect(Field.findByPk).toHaveBeenCalledWith(field.id);
    });

    it('should throw an error if it fails to update as it failed to find the field by id', async () => {
        const error = new Error('Field not found');
        const [field] = fields as FieldAttributes[];

        const findByPk = jest.spyOn(Field, 'findByPk');
        findByPk.mockResolvedValueOnce(null);

        await expect(service.update(field.id, { name: 'Demo' })).rejects.toThrow(error);

        expect(logger.error).toHaveBeenCalledWith(error);
    });


    it('should throw an error if it fails to update', async () => {
         const [field] = fields as FieldAttributes[];
        const error = new Error('Database error');
        const findByPk = jest.spyOn(Field, 'findByPk');

        const sequelizeField = new Field(field)
        sequelizeField.update = jest.fn().mockRejectedValueOnce(error)

        findByPk.mockResolvedValueOnce(sequelizeField);

        await expect(service.update(field.id, { name: 'Demo' })).rejects.toThrow(error);
        expect(logger.error).toHaveBeenCalledWith(error);
    });

    it('should create a new field with valid input', async () => {
        const payload: FieldCreationAttributes = {
            id: "2b9eec45-fd45-488c-afb5-e8035e692228",
            regionId: "2b9eec45-fd45-488c-afb5-e8035e692228",
            name: "Field 1",
            area: 10,
            geometry: {
                "coordinates": [-75.3372987731628, 45.383321536272049]
            }
        };

        const createdField: FieldAttributes = {
            id: "2b9eec45-fd45-488c-afb5-e8035e692228",
            regionId: "2b9eec45-fd45-488c-afb5-e8035e692228",
            name: "Field 1",
            area: 10,
            geometry: {
                "coordinates": [-75.3372987731628, 45.383321536272049]
            }
        };

        const createMock = jest.spyOn(Field, 'create');
        createMock.mockResolvedValueOnce(createdField);

        const result = await service.create(payload);

        expect(result).toEqual(createdField);
        expect(createMock).toHaveBeenCalledWith(payload);
    });

    it('should throw error if failed to create field', async () => {
        const payload: FieldCreationAttributes = {
            id: "2b9eec45-fd45-488c-afb5-e8035e692228",
            regionId: "2b9eec45-fd45-488c-afb5-e8035e692228",
            name: "Field 1",
            area: 10,
            geometry: {
                "coordinates": [-75.3372987731628, 45.383321536272049]
            }
        };

        const error = new Error('Database error');

        const createMock = jest.spyOn(Field, 'create');
        createMock.mockRejectedValueOnce(error);

        await expect(service.create(payload)).rejects.toThrow(error);
        expect(logger.error).toHaveBeenCalledWith(error);
        expect(createMock).toHaveBeenCalledWith(payload);
    });

    it('should return true if field is deleted successfully', async () => {
        const id = '1';

        const destroyMock = jest.spyOn(Field, 'destroy');
        destroyMock.mockResolvedValueOnce(1);

        const result = await service.delete(id);

        expect(result).toEqual(true);
        expect(destroyMock).toHaveBeenCalledWith({ where: { id } });
    });

    it('should return false if no field is deleted', async () => {
        const id = '1';

        const destroyMock = jest.spyOn(Field, 'destroy');
        destroyMock.mockResolvedValueOnce(0);

        const result = await service.delete(id);

        expect(result).toEqual(false);
        expect(destroyMock).toHaveBeenCalledWith({ where: { id } });
    });


    it('should throw error if failed to delete field', async () => {
        const id = '1';
        const error = new Error('Database error');

        const destroyMock = jest.spyOn(Field, 'destroy');
        destroyMock.mockRejectedValueOnce(error);

        await expect(service.delete(id)).rejects.toThrow(error);
        expect(logger.error).toHaveBeenCalledWith(error);
        expect(destroyMock).toHaveBeenCalledWith({ where: { id } });
    });

});
