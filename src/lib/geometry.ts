type Coordinate = [number, number];

type LineStringCoordinates = Coordinate[];

type PolygonCoordinates = Coordinate[][];

export interface Geometry {
    type: string;
    coordinates: Coordinate | LineStringCoordinates | PolygonCoordinates;
}

export type GeometryOrString = string | Geometry;

export function convertGeometryToString(geometry: Geometry) {
    const coordinates = geometry.coordinates.map(coord => coord.join(' ')).join(', ');
    return `POLYGON((${coordinates}))`;

}

export function validateGeometry(input: string | Geometry): boolean {
    const geometryStringPattern = /^([A-Z]+)\((.*)\)$/;

    function isGeometry(obj: any): obj is Geometry {
        return obj && typeof obj.type === 'string' && obj.coordinates !== undefined;
    }

    if (typeof input === 'string') {
        const match = RegExp(geometryStringPattern).exec(input);
        if (match) {
            return true;
        }
        return false;
    } else if (isGeometry(input)) {
        return true; 
    }
    return false;
}
