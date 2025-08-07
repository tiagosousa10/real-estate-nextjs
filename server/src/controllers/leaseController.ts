import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { wktToGeoJSON } from "@terraformer/wkt";

const prisma = new PrismaClient();

export const getLeases = async (req: Request, res: Response): Promise<void> => {
  try {
    const leases = await prisma.lease.findMany({
      include: {
        tenant: true,
        property: true,
      },
    });

    res.json(leases);
  } catch (error: any) {
    console.error("Error getting leases:", error);
    res.status(500).json({ message: `Error getting leases ${error.message}` });
  }
};
