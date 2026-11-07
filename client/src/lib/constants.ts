export const LEVELS = ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Postgraduate"];

export const isPaid = (status: string) => status !== "unpaid" && status !== "failed";