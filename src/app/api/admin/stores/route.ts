import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/require-admin";

const storeSchema = z.object({
  name: z.string().min(2).max(150),
  address: z.string().min(2).max(200),
  city: z.string().min(2).max(100),
  postalCode: z.string().min(2).max(20),
  phone: z.string().min(2).max(30),
  hours: z.string().min(2).max(150),
  imageUrl: z.string().min(1).max(500),
  order: z.number().int().min(0).max(999).default(0),
});

export async function GET(req: NextRequest) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const stores = await prisma.store.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ stores });
}

export async function POST(req: NextRequest) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = storeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  }

  const store = await prisma.store.create({ data: parsed.data });
  return NextResponse.json({ store }, { status: 201 });
}
