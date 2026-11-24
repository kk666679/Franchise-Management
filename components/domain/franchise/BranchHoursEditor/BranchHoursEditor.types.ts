export type DaySchedule = { open: string; close: string; closed: boolean }
export type WeekSchedule = Record<
  "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun",
  DaySchedule
>
