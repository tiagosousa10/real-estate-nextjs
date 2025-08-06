"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProperty = exports.getProperty = exports.getProperties = void 0;
const client_1 = require("@prisma/client");
const wkt_1 = require("@terraformer/wkt");
const client_s3_1 = require("@aws-sdk/client-s3");
const lib_storage_1 = require("@aws-sdk/lib-storage");
const prisma = new client_1.PrismaClient();
const s3Client = new client_s3_1.S3Client({
    region: process.env.AWS_REGION,
});
const getProperties = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { favoriteIds, priceMin, priceMax, beds, baths, propertyType, squareFeetMin, squareFeetMax, amenities, availableFrom, latitude, longitude, } = req.query;
        let whereConditions = [];
        if (favoriteIds) {
            const favoriteIdsArray = favoriteIds.split(",").map(Number);
            whereConditions.push(client_1.Prisma.sql `p.id IN (${client_1.Prisma.join(favoriteIdsArray)})`);
        }
        if (priceMin) {
            whereConditions.push(client_1.Prisma.sql `p."pricePerMonth" >= ${Number(priceMin)}`);
        }
        if (priceMax) {
            whereConditions.push(client_1.Prisma.sql `p."pricePerMonth" <= ${Number(priceMax)}`);
        }
        if (beds && beds !== "any") {
            whereConditions.push(client_1.Prisma.sql `p.beds >= ${Number(beds)}`);
        }
        if (baths && baths !== "any") {
            whereConditions.push(client_1.Prisma.sql `p.baths >= ${Number(baths)}`);
        }
        if (squareFeetMin) {
            whereConditions.push(client_1.Prisma.sql `p."squareFeet" >= ${Number(squareFeetMin)}`);
        }
        if (squareFeetMax) {
            whereConditions.push(client_1.Prisma.sql `p."squareFeet" <= ${Number(squareFeetMax)}`);
        }
        if (propertyType && propertyType !== "any") {
            whereConditions.push(client_1.Prisma.sql `p."propertyType" = ${propertyType}::"PropertyType"`);
        }
        if (amenities && amenities !== "any") {
            const amenitiesArray = amenities.split(",");
            whereConditions.push(client_1.Prisma.sql `p.amenities @> ${amenitiesArray}`);
        }
        if (availableFrom && availableFrom !== "any") {
            const availableFromDate = typeof availableFrom === "string" ? availableFrom : null;
            if (availableFromDate) {
                const date = new Date(availableFromDate);
                if (!isNaN(date.getTime())) {
                    whereConditions.push(client_1.Prisma.sql `EXISTS (
              SELECT 1 FROM "Lease" l 
              WHERE l."propertyId" = p.id 
              AND l."startDate" <= ${date.toISOString()}
            )`);
                }
            }
        }
        if (latitude && longitude) {
            const lat = parseFloat(latitude);
            const lng = parseFloat(longitude);
            const radiusInKilometers = 1000;
            const degrees = radiusInKilometers / 111; // Converts kilometers to degrees
            whereConditions.push(client_1.Prisma.sql `ST_DWithin(
          l.coordinates::geometry,
          ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326),
          ${degrees}
        )`);
        }
        const completeQuery = client_1.Prisma.sql `
      SELECT 
        p.*,
        json_build_object(
          'id', l.id,
          'address', l.address,
          'city', l.city,
          'state', l.state,
          'country', l.country,
          'postalCode', l."postalCode",
          'coordinates', json_build_object(
            'longitude', ST_X(l."coordinates"::geometry),
            'latitude', ST_Y(l."coordinates"::geometry)
          )
        ) as location
      FROM "Property" p
      JOIN "Location" l ON p."locationId" = l.id
      ${whereConditions.length > 0
            ? client_1.Prisma.sql `WHERE ${client_1.Prisma.join(whereConditions, " AND ")}`
            : client_1.Prisma.empty}
    `;
        const properties = yield prisma.$queryRaw(completeQuery);
        res.json(properties);
    }
    catch (error) {
        console.error("Error getting properties:", error);
        res
            .status(500)
            .json({ message: `Error getting properties ${error.message}` });
    }
});
exports.getProperties = getProperties;
const getProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        // find the property
        const property = yield prisma.property.findUnique({
            where: { id: Number(id) },
            include: {
                location: true,
            },
        });
        // get the coordinates of the location of the property
        if (property) {
            const coordinates = yield prisma.$queryRaw `SELECT ST_asText(coordinates) as coordinates from "Location" where id = ${property.location.id}`;
            // Convert WKT to GeoJSON
            const geoJSON = (0, wkt_1.wktToGeoJSON)(((_a = coordinates[0]) === null || _a === void 0 ? void 0 : _a.coordinates) || "");
            const longitude = geoJSON.coordinates[0];
            const latitude = geoJSON.coordinates[1];
            // Add the coordinates to the property
            const propertyWithCoordinates = Object.assign(Object.assign({}, property), { location: Object.assign(Object.assign({}, property.location), { coordinates: {
                        longitude,
                        latitude,
                    } }) });
            res.json(propertyWithCoordinates);
        }
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error retrieving property: ${error.message}` });
    }
});
exports.getProperty = getProperty;
const createProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = req.files;
        const _a = req.body, { address, city, state, country, postalCode, managerCognitoId } = _a, PropertyData = __rest(_a, ["address", "city", "state", "country", "postalCode", "managerCognitoId"]);
        const photoUrls = yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
            const uploadParams = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: `properties/${Date.now()}-${file.originalname}`,
                Body: file.buffer,
                ContentType: file.mimetype,
            };
            const uploadResult = yield new lib_storage_1.Upload({
                client: s3Client,
                params: uploadParams,
            }).done();
            return uploadResult.Location;
        })));
    }
    catch (error) {
        res
            .status(500)
            .json({ message: `Error creating property: ${error.message}` });
    }
});
exports.createProperty = createProperty;
