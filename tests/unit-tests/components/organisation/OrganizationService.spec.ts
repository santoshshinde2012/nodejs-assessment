import { OrganizationService } from "../../../../src/components/organization/OrganizationService";
import { Organization, OrganizationAttributes, OrganizationCreationAttributes } from "../../../../src/database/models/Organization";
import { PropertyAttributes } from "../../../../src/database/models/Property";
import logger from "../../../../src/lib/logger";
import CommonService from "../../../../src/services/CommonService";
import organizations from '../../data/organization.json';
import properties from '../../data/properties.json';
jest.mock('../../../../src/lib/logger');

describe('OrganizationService', () => {
    let service: OrganizationService;

    beforeAll(() => {
        service = new OrganizationService();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return all organizations', async () => {
        const findAll = jest.spyOn(Organization, 'findAll');
        const sequelizeOrganizations = organizations.map((org: OrganizationAttributes) => new Organization(org));
        findAll.mockResolvedValueOnce(sequelizeOrganizations);

        const result = await service.getAll();

        expect(result).toEqual(sequelizeOrganizations);
        expect(findAll).toHaveBeenCalled();
    });

    it('should throw error if failed to fetch organizations', async () => {
        const error = new Error('Database error');
        const findAll = jest.spyOn(Organization, 'findAll');
        findAll.mockRejectedValueOnce(error);
        await expect(service.getAll()).rejects.toThrow(error);
        expect(logger.error).toHaveBeenCalledWith(error);
    });

    it('should return particular organization by id', async () => {
        const [organization] = organizations as OrganizationAttributes[];
        const findByPk = jest.spyOn(Organization, 'findByPk');
        const sequelizeOrganization = new Organization(organization)
        findByPk.mockResolvedValueOnce(sequelizeOrganization);

        const result = await service.getById(organization.id);

        expect(result).toEqual(sequelizeOrganization);
        expect(findByPk).toHaveBeenCalled();
    });

    it('should throw error if failed to fetch empty organization by id', async () => {
        const [organization] = organizations as OrganizationAttributes[];
        const error = new Error('Organization not found');

        const findByPk = jest.spyOn(Organization, 'findByPk');
        findByPk.mockResolvedValueOnce(null);

        await expect(service.getById(organization.id)).rejects.toThrow(error);
        expect(logger.error).toHaveBeenCalledWith(error);
    });

    it('should throw error if failed to fetch organization by id', async () => {
        const [organization] = organizations as OrganizationAttributes[];
        const error = new Error('Database error');

        const findByPk = jest.spyOn(Organization, 'findByPk');
        findByPk.mockRejectedValueOnce(error);

        await expect(service.getById(organization.id)).rejects.toThrow(error);
        expect(logger.error).toHaveBeenCalledWith(error);
    });

    it('should update organization with valid input', async () => {
        const [organization] = organizations as OrganizationAttributes[];
        const findByPk = jest.spyOn(Organization, 'findByPk');

        const sequelizeOrganization = new Organization(organization)
        sequelizeOrganization.update = jest.fn().mockResolvedValueOnce({ ...organization, name: 'Demo' })

        findByPk.mockResolvedValueOnce(sequelizeOrganization);

        const result = await service.update(organization.id, { name: 'Demo' });

        expect(result.name).toEqual('Demo');
        expect(Organization.findByPk).toHaveBeenCalledWith(organization.id);
    });

    it('should throw an error if it fails to update as it failed to find the organization by id', async () => {
        const error = new Error('Organization not found');
        const [organization] = organizations as OrganizationAttributes[];

        const findByPk = jest.spyOn(Organization, 'findByPk');
        findByPk.mockResolvedValueOnce(null);

        await expect(service.update(organization.id, { name: 'Demo' })).rejects.toThrow(error);

        expect(logger.error).toHaveBeenCalledWith(error);
    });


    it('should throw an error if it fails to update', async () => {
         const [organization] = organizations as OrganizationAttributes[];
        const error = new Error('Database error');
        const findByPk = jest.spyOn(Organization, 'findByPk');

        const sequelizeOrganization = new Organization(organization)
        sequelizeOrganization.update = jest.fn().mockRejectedValueOnce(error)

        findByPk.mockResolvedValueOnce(sequelizeOrganization);

        await expect(service.update(organization.id, { name: 'Demo' })).rejects.toThrow(error);
        expect(logger.error).toHaveBeenCalledWith(error);
    });

    it('should create a new organization with valid input', async () => {
        const payload: OrganizationCreationAttributes = {
            id: "2b9eec45-fd45-488c-afb5-e8035e692228",
            name: "Organization 1",
            country: "India",
        };

        // Mocked organization object returned after creation
        const createdOrganization: OrganizationAttributes = {
            id: "2b9eec45-fd45-488c-afb5-e8035e692228",
            name: "Organization 1",
            country: "India",
        };

        const createMock = jest.spyOn(Organization, 'create');
        createMock.mockResolvedValueOnce(createdOrganization);

        const result = await service.create(payload);

        expect(result).toEqual(createdOrganization);
        expect(createMock).toHaveBeenCalledWith(payload);
    });

    it('should throw error if failed to create organization', async () => {
        const payload: OrganizationCreationAttributes = {
            id: "2b9eec45-fd45-488c-afb5-e8035e692228",
            name: "Organization 1",
            country: "India",
        };

        const error = new Error('Database error');

        const createMock = jest.spyOn(Organization, 'create');
        createMock.mockRejectedValueOnce(error);

        await expect(service.create(payload)).rejects.toThrow(error);
        expect(logger.error).toHaveBeenCalledWith(error);
        expect(createMock).toHaveBeenCalledWith(payload);
    });

    it('should return true if organization is deleted successfully', async () => {
        const id = '1';

        const destroyMock = jest.spyOn(Organization, 'destroy');
        destroyMock.mockResolvedValueOnce(1);

        const result = await service.delete(id);

        expect(result).toEqual(true);
        expect(destroyMock).toHaveBeenCalledWith({ where: { id } });
    });

    it('should return false if no organization is deleted', async () => {
        const id = '1';

        const destroyMock = jest.spyOn(Organization, 'destroy');
        destroyMock.mockResolvedValueOnce(0);

        const result = await service.delete(id);

        expect(result).toEqual(false);
        expect(destroyMock).toHaveBeenCalledWith({ where: { id } });
    });


    it('should throw error if failed to delete organization', async () => {
        const id = '1';
        const error = new Error('Database error');

        const destroyMock = jest.spyOn(Organization, 'destroy');
        destroyMock.mockRejectedValueOnce(error);

        await expect(service.delete(id)).rejects.toThrow(error);
        expect(logger.error).toHaveBeenCalledWith(error);
        expect(destroyMock).toHaveBeenCalledWith({ where: { id } });
    });

    it('should return properties by organization ID', async () => {
        const id = '2b9eec45-fd45-488c-afb5-e8035e692228';
        const expectedProperties: PropertyAttributes[] = properties;

        const getPropertiesByOrganizationIdMock = jest.spyOn(CommonService.prototype, 'getPropertiesByOrganizationId');
        getPropertiesByOrganizationIdMock.mockResolvedValueOnce(expectedProperties);

        const result = await service.getPropertiesByOrganizationId(id);

        expect(result).toEqual(expectedProperties);
        expect(getPropertiesByOrganizationIdMock).toHaveBeenCalledWith(id);
    });

    it('should throw error if failed to fetch properties by organization ID', async () => {
        const id = '2b9eec45-fd45-488c-afb5-e8035e692228';
        const error = new Error('Database error');

        const getPropertiesByOrganizationIdMock = jest.spyOn(CommonService.prototype, 'getPropertiesByOrganizationId');
        getPropertiesByOrganizationIdMock.mockRejectedValueOnce(error);

        await expect(service.getPropertiesByOrganizationId(id)).rejects.toThrow(error); 
        expect(logger.error).toHaveBeenCalledWith(error);
        expect(getPropertiesByOrganizationIdMock).toHaveBeenCalledWith(id);
    });

});
