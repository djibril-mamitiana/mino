import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const checkoutSchema = z.object({
  customerName: z.string().min(2).max(200),
  email: z.string().email(),
  phone: z.string().min(6).max(30),
  deliveryMethod: z.enum(["RETRAIT_BOUTIQUE", "LIVRAISON"]),
  address: z.string().max(300).optional(),
  city: z.string().max(120).optional(),
  postalCode: z.string().max(20).optional(),
  notes: z.string().max(500).optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().min(1).max(50),
      })
    )
    .min(1),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données de commande invalides." },
      { status: 400 }
    );
  }

  const data = parsed.data;

  if (data.deliveryMethod === "LIVRAISON" && (!data.address || !data.city || !data.postalCode)) {
    return NextResponse.json(
      { error: "L'adresse de livraison est incomplète." },
      { status: 400 }
    );
  }

  const productIds = data.items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, active: true },
  });

  if (products.length !== productIds.length) {
    return NextResponse.json(
      { error: "Un ou plusieurs produits ne sont plus disponibles." },
      { status: 400 }
    );
  }

  const priceByProductId = new Map(products.map((p) => [p.id, p]));
  const totalCents = data.items.reduce((sum, item) => {
    const product = priceByProductId.get(item.productId)!;
    return sum + product.priceCents * item.quantity;
  }, 0);

  const order = await prisma.order.create({
    data: {
      customerName: data.customerName,
      email: data.email,
      phone: data.phone,
      deliveryMethod: data.deliveryMethod,
      address: data.address,
      city: data.city,
      postalCode: data.postalCode,
      notes: data.notes,
      totalCents,
      items: {
        create: data.items.map((item) => {
          const product = priceByProductId.get(item.productId)!;
          return {
            productId: product.id,
            productName: product.name,
            unitCents: product.priceCents,
            quantity: item.quantity,
          };
        }),
      },
    },
  });

  return NextResponse.json({ orderId: order.id });
}
