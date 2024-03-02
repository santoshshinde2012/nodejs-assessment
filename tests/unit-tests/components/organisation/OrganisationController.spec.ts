import { NextFunction, Request, Response, Router } from 'express';
import OrganizationController from '../../../../src/components/organization/OrganizationController';
import { OrganizationService } from '../../../../src/components/organization/OrganizationService';
import organizations from '../../data/organization.json';
import { OrganizationAttributes } from '../../../../src/database/models/Organization';
import { PropertyAttributes } from '../../../../src/database/models/Property';
import properties from '../../data/properties.json';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import ApiError from '../../../../src/abstractions/ApiError';

describe('Organization Controller', () => {
    let request: Partial<Request>;
    let response: Partial<Response>;
    let next: NextFunction = jest.fn();
    let controller: OrganizationController;

    beforeAll(() => {
        controller = new OrganizationController();
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

    it('should get all organizations', async () => {
        const getAll = jest.spyOn(OrganizationService.prototype, 'getAll');
        getAll.mockResolvedValueOnce(organizations);

        await controller.getOrganizations(request as Request, response as Response, next);

        const locals = response.locals;
        expect(locals?.data).toBeDefined();
    });

    it('should handle errors to get all organizations', async () => {
        const error = new Error('Internal Server Error');
        const getAll = jest.spyOn(OrganizationService.prototype, 'getAll');
        getAll.mockRejectedValueOnce(error);

        await controller.getOrganizations(request as Request, response as Response, next);

        expect(next).toHaveBeenCalled();
    });

    it('should get details of a specific organization', async () => {
        const [organization] = organizations as OrganizationAttributes[];
        const getById = jest.spyOn(OrganizationService.prototype, 'getById');
        getById.mockResolvedValueOnce(organization);

        request.params = { id: '1' };

        await controller.getOrganization(request as Request, response as Response, next);

        const locals = response.locals;

        expect(getById).toHaveBeenCalledWith('1');;
        expect(locals?.data).toBeDefined();
    });

    it('should handle errors to get all organizations', async () => {
        const error = new Error('Internal Server Error');
        const getById = jest.spyOn(OrganizationService.prototype, 'getById');
        getById.mockRejectedValueOnce(error);

        await controller.getOrganization(request as Request, response as Response, next)

        expect(next).toHaveBeenCalled();
    });

    it('should create organization', async () => {
        const [organization] = organizations as OrganizationAttributes[];
        const body = { name: 'New Org' };
        organization.name = 'New Org';
        const create = jest.spyOn(OrganizationService.prototype, 'create');
        create.mockResolvedValueOnce(organization);

        request.body = body;

        await controller.createOrganization(request as Request, response as Response, next);

        expect(create).toHaveBeenCalledWith(body);
        const locals = response.locals;
        expect(locals?.data).toEqual({ organization });
        expect(response.status).toHaveBeenCalledWith(StatusCodes.CREATED);
    });

    it('should throw BAD_REQUEST error if name and country are not provided', async () => {
        request.body = {};

        await controller.createOrganization(request as Request, response as Response, next);

        expect(next).toHaveBeenCalledWith(new ApiError(ReasonPhrases.BAD_REQUEST, StatusCodes.BAD_REQUEST));
    });

    it('should handle errors in create organization', async () => {
        const body = { name: 'New Org' };
        const error = new Error('Internal Server Error');
        const create = jest.spyOn(OrganizationService.prototype, 'create');
        create.mockRejectedValueOnce(error);

        request.body = body;

        await controller.createOrganization(request as Request, response as Response, next);

        expect(create).toHaveBeenCalledWith(body);
        expect(next).toHaveBeenCalledWith(error);
    });

    it('should update organization', async () => {
        const [organization] = organizations as OrganizationAttributes[];
        const { id } = organization;
        const body = { name: 'Updated Org' };
        organization.name = 'Updated Org';

        const update = jest.spyOn(OrganizationService.prototype, 'update');
        update.mockResolvedValueOnce(organization);

        request.params = { id };
        request.body = body;

        await controller.updateOrganization(request as Request, response as Response, next);

        expect(update).toHaveBeenCalledWith(id, body);
        const locals = response.locals;
        expect(locals?.data).toEqual({ organization });
    });

    it('should handle errors in update organization', async () => {
        const [organization] = organizations as OrganizationAttributes[];
        const { id } = organization;
        const body = { name: 'Updated Org' };
        const error = new Error('Internal Server Error');

        const update = jest.spyOn(OrganizationService.prototype, 'update');
        update.mockRejectedValueOnce(error);

        request.params = { id };
        request.body = body;

        await controller.updateOrganization(request as Request, response as Response, next);

        expect(update).toHaveBeenCalledWith(id, body);
        expect(next).toHaveBeenCalledWith(error);
    });

    it('should delete organization', async () => {
        const [organization] = organizations as OrganizationAttributes[];
        const { id } = organization;
        const status = true;

        const remove = jest.spyOn(OrganizationService.prototype, 'delete');
        remove.mockResolvedValueOnce(status);

        request.params = { id };

        await controller.delete(request as Request, response as Response, next);

        expect(remove).toHaveBeenCalledWith(id);
        const locals = response.locals;
        expect(locals?.data).toEqual({ status });
    });

    it('should handle errors in delete organization', async () => {
        const [organization] = organizations as OrganizationAttributes[];
        const { id } = organization;
        const error = new Error('Internal Server Error');

        const remove = jest.spyOn(OrganizationService.prototype, 'delete');
        remove.mockRejectedValueOnce(error);

        request.params = { id };

        await controller.delete(request as Request, response as Response, next);

        expect(remove).toHaveBeenCalledWith(id);
        expect(next).toHaveBeenCalledWith(error);
    });

    it('should get a list of properties owned by a specific organization', async () => {
        const id = '2b9eec45-fd45-488c-afb5-e8035e692228';
        const expectedProperties: PropertyAttributes[] = properties;

        const getPropertiesByOrganizationId = jest.spyOn(OrganizationService.prototype, 'getPropertiesByOrganizationId');
        getPropertiesByOrganizationId.mockResolvedValueOnce(expectedProperties);

        request.params = {
            id
        };

        await controller.getPropertiesByOrganizationId(request as Request, response as Response, next);

        const locals = response.locals;
        expect(locals?.data?.properties).toEqual(expectedProperties);
        expect(getPropertiesByOrganizationId).toHaveBeenCalledWith(id);
    });

    it('should call next function if an error occurs while fetching properties', async () => {
        const id = '2b9eec45-fd45-488c-afb5-e8035e692228';
        const error = new Error('Database error');

        const getPropertiesByOrganizationId = jest.spyOn(OrganizationService.prototype, 'getPropertiesByOrganizationId');
        getPropertiesByOrganizationId.mockRejectedValueOnce(error);

        request.params = {
            id
        };

        await controller.getPropertiesByOrganizationId(request as Request, response as Response, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
