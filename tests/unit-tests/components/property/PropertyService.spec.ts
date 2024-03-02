import { PropertyService } from "../../../../src/components/property/PropertyService";
import { Property, PropertyAttributes, PropertyCreationAttributes } from "../../../../src/database/models/Property";
import logger from "../../../../src/lib/logger";
import properties from '../../data/properties.json';

jest.mock('../../../../src/lib/logger');

describe('PropertyService', () => {
    let service: PropertyService;

    beforeAll(() => {
        service = new PropertyService();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return all properties', async () => {
        const organizationId = '2b9eec45-fd45-488c-afb5-e8035e692228';
        const findAll = jest.spyOn(Property, 'findAll');
        const sequelizePropertys = properties.map((property: PropertyAttributes) => new Property(property));
        findAll.mockResolvedValueOnce(sequelizePropertys);

        const result = await service.query({ organizationId });

        expect(result).toEqual(sequelizePropertys);
        expect(findAll).toHaveBeenCalled();
    });

    it('should throw error if failed to fetch properties', async () => {
        const organizationId = '2b9eec45-fd45-488c-afb5-e8035e692228';
        const error = new Error('Database error');
        const findAll = jest.spyOn(Property, 'findAll');
        findAll.mockRejectedValueOnce(error);
        await expect(service.query({ organizationId })).rejects.toThrow(error);
        expect(logger.error).toHaveBeenCalledWith(error);
    });



    it('should return all properties', async () => {
        const findAll = jest.spyOn(Property, 'findAll');
        const sequelizePropertys = properties.map((property: PropertyAttributes) => new Property(property));
        findAll.mockResolvedValueOnce(sequelizePropertys);

        const result = await service.getAll();

        expect(result).toEqual(sequelizePropertys);
        expect(findAll).toHaveBeenCalled();
    });

    it('should throw error if failed to fetch properties', async () => {
        const error = new Error('Database error');
        const findAll = jest.spyOn(Property, 'findAll');
        findAll.mockRejectedValueOnce(error);
        await expect(service.getAll()).rejects.toThrow(error);
        expect(logger.error).toHaveBeenCalledWith(error);
    });


    it('should return particular property by id', async () => {
        const [property] = properties as PropertyAttributes[];
        const findByPk = jest.spyOn(Property, 'findByPk');
        const sequelizeProperty = new Property(property)
        findByPk.mockResolvedValueOnce(sequelizeProperty);

        const result = await service.getById(property.id);

        expect(result).toEqual(sequelizeProperty);
        expect(findByPk).toHaveBeenCalled();
    });

    it('should throw error if failed to fetch property by id', async () => {
        const [property] = properties as PropertyAttributes[];
        const error = new Error('Database error');

        const findByPk = jest.spyOn(Property, 'findByPk');
        findByPk.mockRejectedValueOnce(error);

        await expect(service.getById(property.id)).rejects.toThrow(error);
        expect(logger.error).toHaveBeenCalledWith(error);
    });

    it('should update property with valid input', async () => {
        const [property] = properties as PropertyAttributes[];
        const findByPk = jest.spyOn(Property, 'findByPk');

        const sequelizeProperty = new Property(property)
        sequelizeProperty.update = jest.fn().mockResolvedValueOnce({ ...property, name: 'Demo' })

        findByPk.mockResolvedValueOnce(sequelizeProperty);

        const result = await service.update(property.id, { name: 'Demo' });

        expect(result.name).toEqual('Demo');
        expect(Property.findByPk).toHaveBeenCalledWith(property.id);
    });

    it('should throw an error if it fails to update as it failed to find the property by id', async () => {
        const error = new Error('Property not found');
        const [property] = properties as PropertyAttributes[];

        const findByPk = jest.spyOn(Property, 'findByPk');
        findByPk.mockResolvedValueOnce(null);

        await expect(service.update(property.id, { name: 'Demo' })).rejects.toThrow(error);

        expect(logger.error).toHaveBeenCalledWith(error);
    });


    it('should throw an error if it fails to update', async () => {
         const [property] = properties as PropertyAttributes[];
        const error = new Error('Database error');
        const findByPk = jest.spyOn(Property, 'findByPk');

        const sequelizeProperty = new Property(property)
        sequelizeProperty.update = jest.fn().mockRejectedValueOnce(error)

        findByPk.mockResolvedValueOnce(sequelizeProperty);

        await expect(service.update(property.id, { name: 'Demo' })).rejects.toThrow(error);
        expect(logger.error).toHaveBeenCalledWith(error);
    });

    it('should create a new property with valid input', async () => {
        const payload: PropertyCreationAttributes = {
            id: "2b9eec45-fd45-488c-afb5-e8035e692228",
            organizationId: "5516c79d-8d48-4122-a7f4-2f7cd0fb7266",
            name: "Property 1"
        };

        // Mocked property object returned after creation
        const createdProperty: PropertyAttributes = {
            id: "2b9eec45-fd45-488c-afb5-e8035e692228",
            name: "Property 1",
            organizationId: "5516c79d-8d48-4122-a7f4-2f7cd0fb7266"
        };

        const createMock = jest.spyOn(Property, 'create');
        createMock.mockResolvedValueOnce(createdProperty);

        const result = await service.create(payload);

        expect(result).toEqual(createdProperty);
        expect(createMock).toHaveBeenCalledWith(payload);
    });

    it('should throw error if failed to create property', async () => {
        const payload: PropertyCreationAttributes = {
            id: "2b9eec45-fd45-488c-afb5-e8035e692228",
            name: "Property 1", 
            organizationId: "5516c79d-8d48-4122-a7f4-2f7cd0fb7266"
        };

        const error = new Error('Database error');

        const createMock = jest.spyOn(Property, 'create');
        createMock.mockRejectedValueOnce(error);

        await expect(service.create(payload)).rejects.toThrow(error);
        expect(logger.error).toHaveBeenCalledWith(error);
        expect(createMock).toHaveBeenCalledWith(payload);
    });

    it('should return true if property is deleted successfully', async () => {
        const id = '1';

        const destroyMock = jest.spyOn(Property, 'destroy');
        destroyMock.mockResolvedValueOnce(1);

        const result = await service.delete(id);

        expect(result).toEqual(true);
        expect(destroyMock).toHaveBeenCalledWith({ where: { id } });
    });

    it('should return false if no property is deleted', async () => {
        const id = '1';

        const destroyMock = jest.spyOn(Property, 'destroy');
        destroyMock.mockResolvedValueOnce(0);

        const result = await service.delete(id);

        expect(result).toEqual(false);
        expect(destroyMock).toHaveBeenCalledWith({ where: { id } });
    });


    it('should throw error if failed to delete property', async () => {
        const id = '1';
        const error = new Error('Database error');

        const destroyMock = jest.spyOn(Property, 'destroy');
        destroyMock.mockRejectedValueOnce(error);

        await expect(service.delete(id)).rejects.toThrow(error);
        expect(logger.error).toHaveBeenCalledWith(error);
        expect(destroyMock).toHaveBeenCalledWith({ where: { id } });
    });

});
