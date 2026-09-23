import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/require-admin";
import { slugify } from "@/lib/slugify";

const categorySchema = z.object({
  name: z.string().min(2).max(100),
  order: z.number().int().min(0).max(999).default(0),
});

export async function GET(req: NextRequest) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { order: "asc" },
  });
  return NextResponse.json({ categories });
}

export async function POST(req: NextRequest) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  }

  const data = parsed.data;
  const baseSlug = slugify(data.name);
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.category.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }

  const category = await prisma.category.create({ data: { ...data, slug } });
  return NextResponse.json({ category }, { status: 201 });
}
