import { redirect } from "next/navigation";

export default function GeoExportRedirect() {
  redirect("/dashboard/location/export");
}