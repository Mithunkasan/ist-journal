import { withPrivateShortCache } from "../../../lib/apiCache";
import prisma from "../../../lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (req.method === "GET") {
    try {
      const guestEditors = await prisma.user.findMany({
        where: {
          role: "GUEST_EDITOR",
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          university: true,
          qualification: true,
          areaOfExpertise: true,
          orcid: true,
          Status: true,
        },
      });

      return withPrivateShortCache(guestEditors, 30);
    } catch (error) {
      console.error(error);
      return new Response("Internal Server Error", { status: 500 });
    }
  } else {
    return new Response("Method Not Allowed", { status: 405 });
  }
}
