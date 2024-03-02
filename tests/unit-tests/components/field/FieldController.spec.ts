import { NextFunction, Request, Response, Router } from 'express';
import FieldController from '../../../../src/components/field/FieldController';
import { FieldService } from '../../../../src/components/field/FieldService';
import { FieldAttributes } from '../../../../src/database/models/Field';
import fields from '../../data/fields.json';

describe('Field Controller', () => {
    let request: Partial<Request>;
    let response: Partial<Response>;
    let next: NextFunction = jest.fn();
    let controller: FieldController;

    beforeAll(() => {
        controller = new FieldController();
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

    it('should get all fields', async () => {
        const getAll = jest.spyOn(FieldService.prototype, 'getAll');
        getAll.mockResolvedValueOnce(fields);

        await controller.getFields(request as Request, response as Response, next);

        const locals = response.locals;
        expect(locals?.data).toBeDefined();
    });

    it('should handle errors to get all fields', async () => {
        const error = new Error('Internal Server Error');
        const getAll = jest.spyOn(FieldService.prototype, 'getAll');
        getAll.mockRejectedValueOnce(error);

        await controller.getFields(request as Request, response as Response, next);

        expect(next).toHaveBeenCalled();
    });

    it('should get details of a specific field', async () => {
        const [field] = fields as FieldAttributes[];
        const getById = jest.spyOn(FieldService.prototype, 'getById');
        getById.mockResolvedValueOnce(field);

        request.params = { id: '1' };

        await controller.getField(request as Request, response as Response, next);

        const locals = response.locals;

        expect(getById).toHaveBeenCalledWith('1');;
        expect(locals?.data).toBeDefined();
    });

    it('should handle errors to get all fields', async () => {
        const error = new Error('Internal Server Error');
        const getById = jest.spyOn(FieldService.prototype, 'getById');
        getById.mockRejectedValueOnce(error);

        await controller.getField(request as Request, response as Response, next)

        expect(next).toHaveBeenCalled();
    });

    it('should create field', async () => {
        const [field] = fields as FieldAttributes[];
        const body = { name: 'New Field' };
        field.name = 'New Field';
        const create = jest.spyOn(FieldService.prototype, 'create');
        create.mockResolvedValueOnce(field);

        request.body = body;

        await controller.createField(request as Request, response as Response, next);

        expect(create).toHaveBeenCalledWith(body);
        const locals = response.locals;
        expect(locals?.data).toEqual({ field });
    });

    it('should handle errors in create field', async () => {
        const body = { name: 'New Field' };
        const error = new Error('Internal Server Error');
        const create = jest.spyOn(FieldService.prototype, 'create');
        create.mockRejectedValueOnce(error);

        request.body = body;

        await controller.createField(request as Request, response as Response, next);

        expect(create).toHaveBeenCalledWith(body);
        expect(next).toHaveBeenCalledWith(error);
    });

    it('should update field', async () => {
        const [field] = fields as FieldAttributes[];
        const { id } = field;
        const body = { name: 'Updated Field' };
        field.name = 'Updated Field';

        const update = jest.spyOn(FieldService.prototype, 'update');
        update.mockResolvedValueOnce(field);

        request.params = { id };
        request.body = body;

        await controller.updateField(request as Request, response as Response, next);

        expect(update).toHaveBeenCalledWith(id, body);
        const locals = response.locals;
        expect(locals?.data).toEqual({ field });
    });

    it('should handle errors in update field', async () => {
        const [field] = fields as FieldAttributes[];
        const { id } = field;
        const body = { name: 'Updated Field' };
        const error = new Error('Internal Server Error');

        const update = jest.spyOn(FieldService.prototype, 'update');
        update.mockRejectedValueOnce(error);

        request.params = { id };
        request.body = body;

        await controller.updateField(request as Request, response as Response, next);

        expect(update).toHaveBeenCalledWith(id, body);
        expect(next).toHaveBeenCalledWith(error);
    });

    it('should delete field', async () => {
        const [field] = fields as FieldAttributes[];
        const { id } = field;
        const status = true;

        const remove = jest.spyOn(FieldService.prototype, 'delete');
        remove.mockResolvedValueOnce(status);

        request.params = { id };

        await controller.delete(request as Request, response as Response, next);

        expect(remove).toHaveBeenCalledWith(id);
        const locals = response.locals;
        expect(locals?.data).toEqual({ status });
    });

    it('should handle errors in delete field', async () => {
        const [field] = fields as FieldAttributes[];
        const { id } = field;
        const error = new Error('Internal Server Error');

        const remove = jest.spyOn(FieldService.prototype, 'delete');
        remove.mockRejectedValueOnce(error);

        request.params = { id };

        await controller.delete(request as Request, response as Response, next);

        expect(remove).toHaveBeenCalledWith(id);
        expect(next).toHaveBeenCalledWith(error);
    });
});
