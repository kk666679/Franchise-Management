import { redirect } from "next/navigation";

export default function GeoImportRedirect() {
  redirect("/dashboard/location/import");
}