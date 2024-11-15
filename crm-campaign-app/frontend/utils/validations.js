import * as z from "zod"

export const customerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters")
})

export const segmentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  criteria: z.object({
    spendingThreshold: z.string().optional(),
    visitCount: z.string().optional(),
    lastVisitDays: z.string().optional()
  }).refine(data => {
    return data.spendingThreshold || data.visitCount || data.lastVisitDays
  }, "At least one criteria must be specified")
})

export const campaignSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  segmentId: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  budget: z.string().min(1, "Budget is required")
}).refine(data => {
  const start = new Date(data.startDate)
  const end = new Date(data.endDate)
  return end > start
}, "End date must be after start date")

export const campaignMessageSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  body: z.string()
    .min(1, "Message body is required")
    .refine(body => body.includes("[Name]"), {
      message: "Message must include [Name] placeholder"
    })
})

export const segmentCriteriaSchema = z.object({
  spendingThreshold: z.number().min(0).optional(),
  visitCount: z.number().min(0).optional(),
  lastVisitDays: z.number().min(0).optional()
}).refine(data => 
  data.spendingThreshold || data.visitCount || data.lastVisitDays, 
  "At least one criteria must be specified"
)