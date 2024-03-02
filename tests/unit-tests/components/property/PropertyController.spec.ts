import { NextFunction, Request, Response, Router } from 'express';
import PropertyController from '../../../../src/components/property/PropertyController';
import { PropertyService } from '../../../../src/components/property/PropertyService';
import { PropertyAttributes } from '../../../../src/database/models/Property';
import properties from '../../data/properties.json';

describe('Property Controller', () => {
    let request: Partial<Request>;
    let response: Partial<Response>;
    let next: NextFunction = jest.fn();
    let controller: PropertyController;

    beforeAll(() => {
        controller = new PropertyController();
    });

    beforeEach(() => {
        request = {} as Partial<Request>;
        response = {
            locals: {},
            status: jest.fn(),
            send: jest.fn()
        } as Partial<Response>;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should register routes and return router', () => {
        const router: Router = controller.register();
        expect(router).toBeTruthy();
    });

    it('should get all properties', async () => {
        const getAll = jest.spyOn(PropertyService.prototype, 'getAll');
        getAll.mockResolvedValueOnce(properties);

        await controller.getProperties(request as Request, response as Response, next);

        const locals = response.locals;
        expect(locals?.data).toBeDefined();
    });

    it('should handle errors to get all properties', async () => {
        const error = new Error('Internal Server Error');
        const getAll = jest.spyOn(PropertyService.prototype, 'getAll');
        getAll.mockRejectedValueOnce(error);

        await controller.getProperties(request as Request, response as Response, next);

        expect(next).toHaveBeenCalled();
    });

    it('should get details of a specific property', async () => {
        const [property] = properties as PropertyAttributes[];
        const getById = jest.spyOn(PropertyService.prototype, 'getById');
        getById.mockResolvedValueOnce(property);

        request.params = { id: '1' };

        await controller.getProperty(request as Request, response as Response, next);

        const locals = response.locals;

        expect(getById).toHaveBeenCalledWith('1');;
        expect(locals?.data).toBeDefined();
    });

    it('should handle errors to get all properties', async () => {
        const error = new Error('Internal Server Error');
        const getById = jest.spyOn(PropertyService.prototype, 'getById');
        getById.mockRejectedValueOnce(error);

        await controller.getProperty(request as Request, response as Response, next)

        expect(next).toHaveBeenCalled();
    });

    it('should create property', async () => {
        const [property] = properties as PropertyAttributes[];
        const body = { name: 'New Property' };
        property.name = 'New Property';
        const create = jest.spyOn(PropertyService.prototype, 'create');
        create.mockResolvedValueOnce(property);

        request.body = body;

        await controller.createProperty(request as Request, response as Response, next);

        expect(create).toHaveBeenCalledWith(body);
        const locals = response.locals;
        expect(locals?.data).toEqual({ property });
    });

    it('should handle errors in create property', async () => {
        const body = { name: 'New Property' };
        const error = new Error('Internal Server Error');
        const create = jest.spyOn(PropertyService.prototype, 'create');
        create.mockRejectedValueOnce(error);

        request.body = body;

        await controller.createProperty(request as Request, response as Response, next);

        expect(create).toHaveBeenCalledWith(body);
        expect(next).toHaveBeenCalledWith(error);
    });

    it('should update property', async () => {
        const [property] = properties as PropertyAttributes[];
        const { id } = property;
        const body = { name: 'Updated Property' };
        property.name = 'Updated Property';

        const update = jest.spyOn(PropertyService.prototype, 'update');
        update.mockResolvedValueOnce(property);

        request.params = { id };
        request.body = body;

        await controller.updateProperty(request as Request, response as Response, next);

        expect(update).toHaveBeenCalledWith(id, body);
        const locals = response.locals;
        expect(locals?.data).toEqual({ property });
    });

    it('should handle errors in update property', async () => {
        const [property] = properties as PropertyAttributes[];
        const { id } = property;
        const body = { name: 'Updated Property' };
        const error = new Error('Internal Server Error');

        const update = jest.spyOn(PropertyService.prototype, 'update');
        update.mockRejectedValueOnce(error);

        request.params = { id };
        request.body = body;

        await controller.updateProperty(request as Request, response as Response, next);

        expect(update).toHaveBeenCalledWith(id, body);
        expect(next).toHaveBeenCalledWith(error);
    });

    it('should delete property', async () => {
        const [property] = properties as PropertyAttributes[];
        const { id } = property;
        const status = true;

        const remove = jest.spyOn(PropertyService.prototype, 'delete');
        remove.mockResolvedValueOnce(status);

        request.params = { id };

        await controller.delete(request as Request, response as Response, next);

        expect(remove).toHaveBeenCalledWith(id);
        const locals = response.locals;
        expect(locals?.data).toEqual({ status });
    });

    it('should handle errors in delete property', async () => {
        const [property] = properties as PropertyAttributes[];
        const { id } = property;
        const error = new Error('Internal Server Error');

        const remove = jest.spyOn(PropertyService.prototype, 'delete');
        remove.mockRejectedValueOnce(error);

        request.params = { id };

        await controller.delete(request as Request, response as Response, next);

        expect(remove).toHaveBeenCalledWith(id);
        expect(next).toHaveBeenCalledWith(error);
    });
});
