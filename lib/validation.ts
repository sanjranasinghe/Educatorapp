import { z } from "zod";
import { yearLevels } from "@/lib/data";

export const checkoutSchema = z.object({
  parentName: z.string().min(2),
  studentName: z.string().min(2),
  email: z.string().email(),
  studentYear: z.enum(yearLevels),
  subject: z.enum(["English", "Maths"]),
  packageId: z.string().min(1),
  tutorId: z.string().min(1),
  scheduledAt: z.string().min(5),
  goals: z.string().min(5)
});

export const liveRoomSchema = z.object({
  roomName: z.string().min(2),
  identity: z.string().min(2),
  name: z.string().min(2)
});
