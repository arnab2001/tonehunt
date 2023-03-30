import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { db } from "~/utils/db.server";

export const loader: LoaderFunction = async ({ request }) => {
  const ampCountReq = db.model.count({
    where: {
      OR: [{ categoryId: 1 }, { categoryId: 5 }],
    },
  });

  const pedalCountReq = db.model.count({
    where: {
      OR: [{ categoryId: 3 }, { categoryId: 7 }],
    },
  });

  const outboardCountReq = db.model.count({
    where: {
      OR: [{ categoryId: 9 }, { categoryId: 10 }],
    },
  });

  const fullRigCountReq = db.model.count({
    where: {
      OR: [{ categoryId: 2 }, { categoryId: 6 }],
    },
  });

  const [ampCount, pedalCount, outboardCount, fullRigCount] = await Promise.all([
    ampCountReq,
    pedalCountReq,
    outboardCountReq,
    fullRigCountReq,
  ]);

  await db.counts.update({
    where: {
      name: "amps",
    },
    data: {
      count: ampCount ?? 0,
    },
  });

  await db.$transaction([
    db.counts.update({
      where: {
        name: "amps",
      },
      data: {
        count: ampCount ?? 0,
      },
    }),
    db.counts.update({
      where: {
        name: "pedals",
      },
      data: {
        count: pedalCount ?? 0,
      },
    }),
    db.counts.update({
      where: {
        name: "fullrigs",
      },
      data: {
        count: fullRigCount ?? 0,
      },
    }),
    db.counts.update({
      where: {
        name: "outboards",
      },
      data: {
        count: outboardCount ?? 0,
      },
    }),
  ]);

  return json({
    counts: {
      ampCount,
      pedalCount,
      outboardCount,
      fullRigCount,
    },
  });
};