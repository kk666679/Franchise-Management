import { redirect } from "next/navigation";

export default function SiteSelectionRedirect() {
  redirect("/dashboard/location/site-selection");
}