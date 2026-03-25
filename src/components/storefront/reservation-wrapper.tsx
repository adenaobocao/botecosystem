import { getTableStatusToday } from "@/lib/queries/reservations";
import { serialize } from "@/lib/utils";
import { ReservationSection } from "./reservation-section";

export async function ReservationWrapper() {
  let tableStatus;
  try {
    tableStatus = serialize(await getTableStatusToday());
  } catch {
    tableStatus = { available: true, reservation: null };
  }

  return <ReservationSection tableStatus={tableStatus} />;
}
