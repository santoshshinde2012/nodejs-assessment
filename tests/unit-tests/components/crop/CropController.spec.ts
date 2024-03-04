import { NextFunction, Request, Response, Router } from 'express';
import CropController from '../../../../src/components/crop/CropController';
import { CropService } from '../../../../src/components/crop/CropService';
import crops from '../../data/crops.json';
import { CropAttributes } from '../../../../src/database/models/Crop';
import ApiError from '../../../../src/abstractions/ApiError';
import { StatusCodes } from 'http-status-codes';

describe('Crop Controller', () => {
    let request: Partial<Request>;
    let response: Partial<Response>;
    let next: NextFunction = jest.fn();
    let controller: CropController;

    beforeAll(() => {
        controller = new CropController();
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

    it('should get all crops', async () => {
        const getAll = jest.spyOn(CropService.prototype, 'getAll');
        getAll.mockResolvedValueOnce(crops);

        await controller.getCrops(request as Request, response as Response, next);

        const locals = response.locals;
        expect(locals?.data).toBeDefined();
    });

    it('should handle errors to get all crops', async () => {
        const error = new Error('Internal Server Error');
        const getAll = jest.spyOn(CropService.prototype, 'getAll');
        getAll.mockRejectedValueOnce(error);

        await controller.getCrops(request as Request, response as Response, next);

        expect(next).toHaveBeenCalled();
    });

    it('should get details of a specific crop', async () => {
        const [crop] = crops as CropAttributes[];
        const getById = jest.spyOn(CropService.prototype, 'getById');
        getById.mockResolvedValueOnce(crop);

        request.params = { id: '1' };

        await controller.getCrop(request as Request, response as Response, next);

        const locals = response.locals;

        expect(getById).toHaveBeenCalledWith('1');;
        expect(locals?.data).toBeDefined();
    });

    it('should handle errors to get specific crop', async () => {
        const error = new Error('Internal Server Error');
        const getById = jest.spyOn(CropService.prototype, 'getById');
        getById.mockRejectedValueOnce(error);

        await controller.getCrop(request as Request, response as Response, next)

        expect(next).toHaveBeenCalled();
    });

    it('should create crop', async () => {
        const [crop] = crops as CropAttributes[];
        const body = { name: 'New crop' };
        crop.name = 'New crop';
        const create = jest.spyOn(CropService.prototype, 'create');
        create.mockResolvedValueOnce(crop);

        request.body = body;

        await controller.createCrop(request as Request, response as Response, next);

        expect(create).toHaveBeenCalledWith(body);
        const locals = response.locals;
        expect(locals?.data).toEqual({ crop });
    });

    it('should handle errors in create crop', async () => {
        const body = { name: 'New crop' };
        const error = new Error('Internal Server Error');
        const create = jest.spyOn(CropService.prototype, 'create');
        create.mockRejectedValueOnce(error);

        request.body = body;

        await controller.createCrop(request as Request, response as Response, next);

        expect(create).toHaveBeenCalledWith(body);
        expect(next).toHaveBeenCalledWith(error);
    });

    it('should update crop', async () => {
        const [crop] = crops as CropAttributes[];
        const { id } = crop;
        const body = { name: 'Updated crop' };
        crop.name = 'Updated crop';

        const update = jest.spyOn(CropService.prototype, 'update');
        update.mockResolvedValueOnce(crop);

        request.params = { id };
        request.body = body;

        await controller.updateCrop(request as Request, response as Response, next);

        expect(update).toHaveBeenCalledWith(id, body);
        const locals = response.locals;
        expect(locals?.data).toEqual({ crop });
    });

    it('should handle errors in update crop', async () => {
        const [crop] = crops as CropAttributes[];
        const { id } = crop;
        const body = { name: 'Updated crop' };
        const error = new Error('Internal Server Error');

        const update = jest.spyOn(CropService.prototype, 'update');
        update.mockRejectedValueOnce(error);

        request.params = { id };
        request.body = body;

        await controller.updateCrop(request as Request, response as Response, next);

        expect(update).toHaveBeenCalledWith(id, body);
        expect(next).toHaveBeenCalledWith(error);
    });

    it('should delete crop', async () => {
        const [crop] = crops as CropAttributes[];
        const { id } = crop;
        const status = true;

        const remove = jest.spyOn(CropService.prototype, 'delete');
        remove.mockResolvedValueOnce(status);

        request.params = { id };

        await controller.delete(request as Request, response as Response, next);

        expect(remove).toHaveBeenCalledWith(id);
        const locals = response.locals;
        expect(locals?.data).toEqual({ status });
    });

    it('should handle errors in delete crop', async () => {
        const [crop] = crops as CropAttributes[];
        const { id } = crop;
        const error = new Error('Internal Server Error');

        const remove = jest.spyOn(CropService.prototype, 'delete');
        remove.mockRejectedValueOnce(error);

        request.params = { id };

        await controller.delete(request as Request, response as Response, next);

        expect(remove).toHaveBeenCalledWith(id);
        expect(next).toHaveBeenCalledWith(error);
    });
});
