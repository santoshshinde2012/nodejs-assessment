import { NextFunction, Request, Response, Router } from 'express';
import CropCycleController from '../../../../src/components/crop_cycle/CropCycleController';
import { CropCycleService } from '../../../../src/components/crop_cycle/CropCycleService';
import cropCycles from '../../data/crop_cycles.json';
import { CropCycleAttributes } from '../../../../src/database/models/CropCycle';

describe('CropCycle Controller', () => {
    let request: Partial<Request>;
    let response: Partial<Response>;
    let next: NextFunction = jest.fn();
    let controller: CropCycleController;

    beforeAll(() => {
        controller = new CropCycleController();
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

    it('should get all cropCycles', async () => {
        const getAll = jest.spyOn(CropCycleService.prototype, 'getAll');
        getAll.mockResolvedValueOnce(cropCycles);

        await controller.getCropCycles(request as Request, response as Response, next);

        const locals = response.locals;
        expect(locals?.data).toBeDefined();
    });

    it('should handle errors to get all cropCycles', async () => {
        const error = new Error('Internal Server Error');
        const getAll = jest.spyOn(CropCycleService.prototype, 'getAll');
        getAll.mockRejectedValueOnce(error);

        await controller.getCropCycles(request as Request, response as Response, next);

        expect(next).toHaveBeenCalled();
    });

    it('should get details of a specific cropCycle', async () => {
        const [cropCycle] = cropCycles as CropCycleAttributes[];
        const getById = jest.spyOn(CropCycleService.prototype, 'getById');
        getById.mockResolvedValueOnce(cropCycle);

        request.params = { id: '1' };

        await controller.getCropCycle(request as Request, response as Response, next);

        const locals = response.locals;

        expect(getById).toHaveBeenCalledWith('1');;
        expect(locals?.data).toBeDefined();
    });

    it('should handle errors to get all cropCycles', async () => {
        const error = new Error('Internal Server Error');
        const getById = jest.spyOn(CropCycleService.prototype, 'getById');
        getById.mockRejectedValueOnce(error);

        await controller.getCropCycle(request as Request, response as Response, next)

        expect(next).toHaveBeenCalled();
    });

    it('should create cropCycle', async () => {
        const [cropCycle] = cropCycles as CropCycleAttributes[];
        const body = { name: 'New cropCycle' };
        cropCycle.name = 'New cropCycle';
        const create = jest.spyOn(CropCycleService.prototype, 'create');
        create.mockResolvedValueOnce(cropCycle);

        request.body = body;

        await controller.createCropCycle(request as Request, response as Response, next);

        expect(create).toHaveBeenCalledWith(body);
        const locals = response.locals;
        expect(locals?.data).toEqual({ cropCycle });
    });

    it('should handle errors in create cropCycle', async () => {
        const body = { name: 'New cropCycle' };
        const error = new Error('Internal Server Error');
        const create = jest.spyOn(CropCycleService.prototype, 'create');
        create.mockRejectedValueOnce(error);

        request.body = body;

        await controller.createCropCycle(request as Request, response as Response, next);

        expect(create).toHaveBeenCalledWith(body);
        expect(next).toHaveBeenCalledWith(error);
    });

    it('should update cropCycle', async () => {
        const [cropCycle] = cropCycles as CropCycleAttributes[];
        const { id } = cropCycle;
        const body = { name: 'Updated cropCycle' };
        cropCycle.name = 'Updated cropCycle';

        const update = jest.spyOn(CropCycleService.prototype, 'update');
        update.mockResolvedValueOnce(cropCycle);

        request.params = { id };
        request.body = body;

        await controller.updateCropCycle(request as Request, response as Response, next);

        expect(update).toHaveBeenCalledWith(id, body);
        const locals = response.locals;
        expect(locals?.data).toEqual({ cropCycle });
    });

    it('should handle errors in update cropCycle', async () => {
        const [cropCycle] = cropCycles as CropCycleAttributes[];
        const { id } = cropCycle;
        const body = { name: 'Updated cropCycle' };
        const error = new Error('Internal Server Error');

        const update = jest.spyOn(CropCycleService.prototype, 'update');
        update.mockRejectedValueOnce(error);

        request.params = { id };
        request.body = body;

        await controller.updateCropCycle(request as Request, response as Response, next);

        expect(update).toHaveBeenCalledWith(id, body);
        expect(next).toHaveBeenCalledWith(error);
    });

    it('should delete cropCycle', async () => {
        const [cropCycle] = cropCycles as CropCycleAttributes[];
        const { id } = cropCycle;
        const status = true;

        const remove = jest.spyOn(CropCycleService.prototype, 'delete');
        remove.mockResolvedValueOnce(status);

        request.params = { id };

        await controller.delete(request as Request, response as Response, next);

        expect(remove).toHaveBeenCalledWith(id);
        const locals = response.locals;
        expect(locals?.data).toEqual({ status });
    });

    it('should handle errors in delete cropCycle', async () => {
        const [cropCycle] = cropCycles as CropCycleAttributes[];
        const { id } = cropCycle;
        const error = new Error('Internal Server Error');

        const remove = jest.spyOn(CropCycleService.prototype, 'delete');
        remove.mockRejectedValueOnce(error);

        request.params = { id };

        await controller.delete(request as Request, response as Response, next);

        expect(remove).toHaveBeenCalledWith(id);
        expect(next).toHaveBeenCalledWith(error);
    });
});
