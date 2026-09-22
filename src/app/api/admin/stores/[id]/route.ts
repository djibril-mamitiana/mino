import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/require-admin";

const updateSchema = z.object({
  name: z.string().min(2).max(150).optional(),
  address: z.string().min(2).max(200).optional(),
  city: z.string().min(2).max(100).optional(),
  postalCode: z.string().min(2).max(20).optional(),
  phone: z.string().min(2).max(30).optional(),
  hours: z.string().min(2).max(150).optional(),
  imageUrl: z.string().min(1).max(500).optional(),
  order: z.number().int().min(0).max(999).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  }

  const store = await prisma.store.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ store });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { id } = await params;
  await prisma.store.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
