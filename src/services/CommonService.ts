import { PropertyService } from '../components/property/PropertyService';
import { PropertyAttributes } from '../database/models/Property';

class CommonService {
	private propertyService: PropertyService;

	constructor() {
		this.propertyService = new PropertyService();
	}

	async getPropertiesByOrganizationId(
		organizationId: number | string,
	): Promise<PropertyAttributes[]> {
		const properties = await this.propertyService.query({
			organizationId,
		});
		return properties;
	}
}

export default CommonService;
