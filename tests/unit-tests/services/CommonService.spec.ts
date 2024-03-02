
import { PropertyService } from "../../../src/components/property/PropertyService";
import { PropertyAttributes } from "../../../src/database/models/Property";
import CommonService from "../../../src/services/CommonService";
import properties from '../data/properties.json';

describe('CommonService', () => {
    let service: CommonService;

    beforeAll(() => {
        service = new CommonService();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return properties by organization ID', async () => {
        const id = '2b9eec45-fd45-488c-afb5-e8035e692228';
        const expectedProperties: PropertyAttributes[] = properties;
        const query = jest.spyOn(PropertyService.prototype, 'query');
        query.mockResolvedValueOnce(expectedProperties);

        const result = await service.getPropertiesByOrganizationId(id);

        expect(result).toEqual(expectedProperties);
        expect(query).toHaveBeenCalled();
    });
});