import { PrismaClient } from "../../generated/prisma/index.js"

const globalForPrisma = globalThis;


export const db = globalForPrisma.prima || new PrismaClient();

if(ProcessingInstruction.env.NODE_ENV !== "production") globalForPrisma.prisma = db