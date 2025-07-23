import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

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
