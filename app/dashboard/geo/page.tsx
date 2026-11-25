import { redirect } from "next/navigation";

export default function GeoDashboardRedirect() {
  redirect("/dashboard/location");
}