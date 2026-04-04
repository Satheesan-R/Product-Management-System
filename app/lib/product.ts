import { z } from "zod";

export const PRODUCT_STORAGE_KEY = "product-management-products";

export type Product = {
	id: string;
	name: string;
	price: number;
	description: string;
	imageUrl?: string;
	createdAt: string;
};

export const productSchema = z.object({
	name: z.string().trim().min(2, "Product name must be at least 2 characters"),
	price: z
		.string()
		.trim()
		.min(1, "Price is required")
		.refine((value) => !Number.isNaN(Number(value)), "Price must be a valid number")
		.refine((value) => Number(value) >= 0, "Price cannot be negative"),
	description: z.string().trim().min(5, "Description must be at least 5 characters"),
	imageUrl: z
		.string()
		.trim()
		.optional()
		.refine(
			(value) =>
				!value ||
				/^https?:\/\//i.test(value) ||     // allow URL
				value.startsWith("data:image"),    // allow uploaded base64
			"Image must be a valid URL or uploaded image"
		),
});

export type ProductFormInput = z.infer<typeof productSchema>;

export function loadProductsFromStorage(): Product[] {
	if (typeof window === "undefined") {
		return [];
	}

	const raw = window.localStorage.getItem(PRODUCT_STORAGE_KEY);
	if (!raw) {
		return [];
	}

	try {
		const parsed = JSON.parse(raw) as Product[];
		if (!Array.isArray(parsed)) {
			return [];
		}

		return parsed.filter(
			(item) =>
				typeof item.id === "string" &&
				typeof item.name === "string" &&
				typeof item.price === "number" &&
				typeof item.description === "string" &&
				typeof item.createdAt === "string",
		);
	} catch {
		return [];
	}
}

export function saveProductsToStorage(products: Product[]): void {
	if (typeof window === "undefined") {
		return;
	}

	window.localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(products));
}

export function formatCurrency(amount: number): string {
	return new Intl.NumberFormat("en-LK", {
		style: "currency",
		currency: "LKR",
		maximumFractionDigits: 2,
	}).format(amount);
}
