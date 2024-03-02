-- Insert initial record in Organization Table 
CREATE EXTENSION IF NOT EXISTS postgis;

-- Insert initial record in Organization Table 
INSERT INTO "Organization" (id, name, country, "createdAt", "updatedAt")
VALUES 
    (gen_random_uuid(), 'Organization 1', 'India', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (gen_random_uuid(),  'Organization 2', 'Ireland', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert initial record in Property Table
INSERT INTO "Property" (id, name, "organizationId", "createdAt", "updatedAt")
VALUES 
    (gen_random_uuid(), 'Property 1',  (SELECT id FROM "Organization" LIMIT 1), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
     (gen_random_uuid(), 'Property 2',  (SELECT id FROM "Organization" LIMIT 1), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert initial record in Region Table without parent region
INSERT INTO "Region" ( id, "propertyId", "parentRegionId", name, geometry, area, "createdAt", "updatedAt" ) 
VALUES 
    (gen_random_uuid(), (SELECT id FROM "Property" LIMIT 1), null, 'Region1', 'POLYGON((0 0, 1 1, 1 0, 0 0))', 100.0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert initial record in Region Table with parent region
INSERT INTO "Region" ( id, "propertyId", "parentRegionId", name, geometry, area, "createdAt", "updatedAt" ) 
VALUES 
    (gen_random_uuid(), (SELECT id FROM "Property" LIMIT 1), (SELECT id FROM "Region" LIMIT 1), 'Region1', 'POLYGON((0 0, 1 1, 1 0, 0 0))', 100.0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


-- Insert initial record in Field Table 
INSERT INTO "Field" ( id, "regionId", name, geometry, area, "createdAt", "updatedAt" ) 
VALUES 
    (gen_random_uuid(), (SELECT id FROM "Region" LIMIT 1), 'Field1', 'POLYGON((0 0, 1 1, 1 0, 0 0))', 100.0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert initial record in Crop Table 
INSERT INTO "Crop" (id, name, type, "createdAt", "updatedAt")
VALUES
    (gen_random_uuid(), 'Wheat', 'Grain', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'Apple', 'Fruit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'Tomato', 'Vegetable', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'Lentil', 'Legume', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'Basil', 'Herb', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'Carrot', 'Root', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'Potato', 'Tuber', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'Sunflower', 'Oilseed', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'Cinnamon', 'Spice', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'Tea', 'Beverage', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert initial record in Crop Cycle for Property 
INSERT INTO "CropCycle"
(id, "name", "cropId", "propertyId", "fieldId", "plantingDate", "harvestDate", "createdAt", "updatedAt")
VALUES(gen_random_uuid(), 'CropCycle 1', (SELECT id FROM "Crop" LIMIT 1), (SELECT id FROM "Property" OFFSET 1 LIMIT 1), null, '2024-03-01', '2024-06-30', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert initial record in Crop Cycle for Field 
INSERT INTO "CropCycle"
(id, "name", "cropId", "propertyId", "fieldId", "plantingDate", "harvestDate", "createdAt", "updatedAt")
VALUES(gen_random_uuid(), 'CropCycle 1', (SELECT id FROM "Crop"  OFFSET 1 LIMIT 1), null, (SELECT id FROM "Field" LIMIT 1), '2024-03-01', '2024-06-30', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
