import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { wktToGeoJSON } from "@terraformer/wkt";

const prisma = new PrismaClient();

export const getManager = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId } = req.params;
    const manager = await prisma.manager.findUnique({
      where: {
        cognitoId: cognitoId,
      },
    });

    if (manager) {
      res.json(manager);
    } else {
      res.status(404).json({ message: "manager not found" });
    }
  } catch (error: any) {
    console.error("Error getting manager:", error);
    res.status(500).json({ message: `Error getting manager ${error.message}` });
  }
};

export const createManager = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId, name, email, phoneNumber } = req.body;
    const manager = await prisma.manager.create({
      data: {
        cognitoId: cognitoId,
        name: name,
        email: email,
        phoneNumber: phoneNumber,
      },
    });
    res.status(201).json(manager);
  } catch (error: any) {
    console.error("Error creating manager:", error);
    res
      .status(500)
      .json({ message: `Error creating manager ${error.message}` });
  }
};

export const updateManager = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId } = req.params;
    const { name, email, phoneNumber } = req.body;

    const updateManager = await prisma.manager.update({
      where: {
        cognitoId: cognitoId,
      },
      data: {
        name: name,
        email: email,
        phoneNumber: phoneNumber,
      },
    });
    res.status(201).json(updateManager);
  } catch (error: any) {
    console.error("Error updating manager:", error);
    res
      .status(500)
      .json({ message: `Error updating manager ${error.message}` });
  }
};

export const getManagerProperties = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId } = req.params;


    const properties = await prisma.property.findMany({
      where: {
        managerCognitoId: cognitoId,
      },
      include: {
        location: true,
      },
    });

    const propertiesWithFormattedLocation = await Promise.all(
      properties.map(async (property) => {
        const coordinates: { coordinates: string }[] =
        await prisma.$queryRaw`SELECT ST_asText(coordinates) as coordinates from "Location" where id = ${property.location.id}`;

      // Convert WKT to GeoJSON
      const geoJSON: any = wktToGeoJSON(coordinates[0]?.coordinates || "");
      const longitude = geoJSON.coordinates[0];
      const latitude = geoJSON.coordinates[1];

      // Add the coordinates to the property
      const propertyWithCoordinates = {
        ...property,
        location: {
          ...property.location,
          coordinates: {
            longitude,
            latitude,
          },
      })
    )

      res.json(propertiesWithFormattedLocation);
    
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving manager properties: ${error.message}` });
  }
};
