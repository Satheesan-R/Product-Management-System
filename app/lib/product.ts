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

const DEFAULT_PRODUCTS: Product[] = [
	{
		id: "seed-watch",
		name: "Watch",
		price: 10000,
		description:
			"A watch is a portable timepiece designed to be worn on the wrist or carried in a pocket, maintaining accurate time despite the motion of the wearer. Modern watches have evolved from simple timekeeping tools into accessories that reflect style, status, and technical expertise.",
		createdAt: "2026-01-01T08:00:00.000Z",
	},
	{
		id: "seed-camera-lens",
		name: "Camera lens",
		price: 85000,
		description:
			"A camera lens is the primary optical component of a camera system that transmits light onto the camera's sensor, turning what you see into a sharp, detailed image. It functions as the eye of the camera, determining how much of a scene is captured and how large subjects appear.",
		createdAt: "2026-01-02T08:00:00.000Z",
	},
	{
		id: "seed-cosmetics",
		name: "cosmetics",
		price: 1500,
		description:
			"Its not affect anyone trust me everone can use this produce and get benefits form this profuce in my opiniion i also try this one and get good results form this produvt",
		createdAt: "2026-01-03T08:00:00.000Z",
	},
];


export function getDefaultProducts(): Product[] {
	return DEFAULT_PRODUCTS.map((product) => ({ ...product }));
}

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
		return getDefaultProducts();
	}

	try {
		const parsed = JSON.parse(raw) as Product[];
		if (!Array.isArray(parsed)) {
			return getDefaultProducts();
		}

		const validProducts = parsed.filter(
			(item) =>
				typeof item.id === "string" &&
				typeof item.name === "string" &&
				typeof item.price === "number" &&
				typeof item.description === "string" &&
				typeof item.createdAt === "string",
		);

		if (validProducts.length === 0) {
			return getDefaultProducts();
		}

		return validProducts;
	} catch {
		return getDefaultProducts();
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
