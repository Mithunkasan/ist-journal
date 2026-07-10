import { auth } from "@/auth";
import {
  DEFAULT_ADMIN_REDIRECT,
  DEFAULT_ASSOCIATE_EDITOR_REDIRECT,
  DEFAULT_AUTHOR_REDIRECT,
  DEFAULT_EDITOR_REDIRECT,
  DEFAULT_REVIEWER_REDIRECT,
} from "@/routes";
import { redirect } from "next/navigation";

export default async function DashboardRedirectPage() {
  const session = await auth();

  switch (session?.user?.role) {
    case "ADMIN":
      redirect(DEFAULT_ADMIN_REDIRECT);
    case "EDITOR":
      redirect(DEFAULT_EDITOR_REDIRECT);
    case "ASSOCIATE_EDITOR":
      redirect(DEFAULT_ASSOCIATE_EDITOR_REDIRECT);
    case "REVIEWER":
      redirect(DEFAULT_REVIEWER_REDIRECT);
    case "AUTHOR":
      redirect(DEFAULT_AUTHOR_REDIRECT);
    default:
      redirect("/");
  }
}
