import { NextFunction, Request, Response, Router } from 'express';
import RegionController from '../../../../src/components/region/RegionController';
import { RegionService } from '../../../../src/components/region/RegionService';
import { RegionAttributes } from '../../../../src/database/models/Region';
import regions from '../../data/regions.json';

describe('Region Controller', () => {
    let request: Partial<Request>;
    let response: Partial<Response>;
    let next: NextFunction = jest.fn();
    let controller: RegionController;

    beforeAll(() => {
        controller = new RegionController();
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

    it('should get all regions', async () => {
        const getAll = jest.spyOn(RegionService.prototype, 'getAll');
        getAll.mockResolvedValueOnce(regions);

        await controller.getRegions(request as Request, response as Response, next);

        const locals = response.locals;
        expect(locals?.data).toBeDefined();
    });

    it('should handle errors to get all regions', async () => {
        const error = new Error('Internal Server Error');
        const getAll = jest.spyOn(RegionService.prototype, 'getAll');
        getAll.mockRejectedValueOnce(error);

        await controller.getRegions(request as Request, response as Response, next);

        expect(next).toHaveBeenCalled();
    });

    it('should get details of a specific region', async () => {
        const [region] = regions as RegionAttributes[];
        const getById = jest.spyOn(RegionService.prototype, 'getById');
        getById.mockResolvedValueOnce(region);

        request.params = { id: '1' };

        await controller.getRegion(request as Request, response as Response, next);

        const locals = response.locals;

        expect(getById).toHaveBeenCalledWith('1');;
        expect(locals?.data).toBeDefined();
    });

    it('should handle errors to get all regions', async () => {
        const error = new Error('Internal Server Error');
        const getById = jest.spyOn(RegionService.prototype, 'getById');
        getById.mockRejectedValueOnce(error);

        await controller.getRegion(request as Request, response as Response, next)

        expect(next).toHaveBeenCalled();
    });

    it('should create region', async () => {
        const [region] = regions as RegionAttributes[];
        const body = { name: 'New Region' };
        region.name = 'New Region';
        const create = jest.spyOn(RegionService.prototype, 'create');
        create.mockResolvedValueOnce(region);

        request.body = body;

        await controller.createRegion(request as Request, response as Response, next);

        expect(create).toHaveBeenCalledWith(body);
        const locals = response.locals;
        expect(locals?.data).toEqual({ region });
    });

    it('should handle errors in create region', async () => {
        const body = { name: 'New Region' };
        const error = new Error('Internal Server Error');
        const create = jest.spyOn(RegionService.prototype, 'create');
        create.mockRejectedValueOnce(error);

        request.body = body;

        await controller.createRegion(request as Request, response as Response, next);

        expect(create).toHaveBeenCalledWith(body);
        expect(next).toHaveBeenCalledWith(error);
    });

    it('should update region', async () => {
        const [region] = regions as RegionAttributes[];
        const { id } = region;
        const body = { name: 'Updated Region' };
        region.name = 'Updated Region';

        const update = jest.spyOn(RegionService.prototype, 'update');
        update.mockResolvedValueOnce(region);

        request.params = { id };
        request.body = body;

        await controller.updateRegion(request as Request, response as Response, next);

        expect(update).toHaveBeenCalledWith(id, body);
        const locals = response.locals;
        expect(locals?.data).toEqual({ region });
    });

    it('should handle errors in update region', async () => {
        const [region] = regions as RegionAttributes[];
        const { id } = region;
        const body = { name: 'Updated Region' };
        const error = new Error('Internal Server Error');

        const update = jest.spyOn(RegionService.prototype, 'update');
        update.mockRejectedValueOnce(error);

        request.params = { id };
        request.body = body;

        await controller.updateRegion(request as Request, response as Response, next);

        expect(update).toHaveBeenCalledWith(id, body);
        expect(next).toHaveBeenCalledWith(error);
    });

    it('should delete region', async () => {
        const [region] = regions as RegionAttributes[];
        const { id } = region;
        const status = true;

        const remove = jest.spyOn(RegionService.prototype, 'delete');
        remove.mockResolvedValueOnce(status);

        request.params = { id };

        await controller.delete(request as Request, response as Response, next);

        expect(remove).toHaveBeenCalledWith(id);
        const locals = response.locals;
        expect(locals?.data).toEqual({ status });
    });

    it('should handle errors in delete region', async () => {
        const [region] = regions as RegionAttributes[];
        const { id } = region;
        const error = new Error('Internal Server Error');

        const remove = jest.spyOn(RegionService.prototype, 'delete');
        remove.mockRejectedValueOnce(error);

        request.params = { id };

        await controller.delete(request as Request, response as Response, next);

        expect(remove).toHaveBeenCalledWith(id);
        expect(next).toHaveBeenCalledWith(error);
    });
});
