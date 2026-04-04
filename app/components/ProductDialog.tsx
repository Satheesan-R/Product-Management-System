"use client";

import { useEffect, useMemo, useState } from "react";
import {
	productSchema,
	type Product,
	type ProductFormInput,
} from "@/app/lib/product";

type ProductDialogProps = {
	open: boolean;
	mode: "create" | "edit";
	initialProduct?: Product | null;
	onClose: () => void;
	onSubmit: (payload: {
		name: string;
		price: number;
		description: string;
		imageUrl?: string;
	}) => void;
};

type FormErrors = Partial<Record<keyof ProductFormInput, string>>;

const EMPTY_FORM: ProductFormInput = {
	name: "",
	price: "",
	description: "",
	imageUrl: "",
};

export default function ProductDialog({
	open,
	mode,
	initialProduct,
	onClose,
	onSubmit,
}: ProductDialogProps) {
	const [form, setForm] = useState<ProductFormInput>(EMPTY_FORM);
	const [errors, setErrors] = useState<FormErrors>({});

	useEffect(() => {
		if (!open) {
			return;
		}

		if (mode === "edit" && initialProduct) {
			setForm({
				name: initialProduct.name,
				price: String(initialProduct.price),
				description: initialProduct.description,
				imageUrl: initialProduct.imageUrl ?? "",
			});
			setErrors({});
			return;
		}

		setForm(EMPTY_FORM);
		setErrors({});
	}, [open, mode, initialProduct]);

	const title = useMemo(
		() => (mode === "create" ? "Add Product" : "Edit Product"),
		[mode],
	);

	if (!open) {
		return null;
	}

	function updateField<K extends keyof ProductFormInput>(
		key: K,
		value: ProductFormInput[K],
	) {
		setForm((previous) => ({ ...previous, [key]: value }));
		setErrors((previous) => ({ ...previous, [key]: undefined }));
	}

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const result = productSchema.safeParse(form);
		if (!result.success) {
			const fieldErrors: FormErrors = {};
			const flattened = result.error.flatten().fieldErrors;

			for (const key of Object.keys(flattened) as (keyof ProductFormInput)[]) {
				fieldErrors[key] = flattened[key]?.[0];
			}

			setErrors(fieldErrors);
			return;
		}

		onSubmit({
			name: result.data.name.trim(),
			price: Number(result.data.price),
			description: result.data.description.trim(),
			imageUrl: result.data.imageUrl?.trim() || undefined,
		});

		onClose();
	}

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-8"
			role="dialog"
			aria-modal="true"
			aria-label={title}
		>
			<div className="w-full max-w-xl rounded-2xl border border-stone-200 bg-white p-6 shadow-xl">
				<div className="mb-5 flex items-start justify-between gap-4">
					<div>
						<h2 className="text-xl font-semibold text-stone-900">{title}</h2>
						<p className="mt-1 text-sm text-stone-600">
							Fill the details below and save changes.
						</p>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="rounded-md p-2 text-stone-500 transition hover:bg-stone-100 hover:text-stone-700"
						aria-label="Close dialog"
					>
						x
					</button>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="mb-1.5 block text-sm font-medium text-stone-700" htmlFor="name">
							Product Name
						</label>
						<input
							id="name"
							type="text"
							value={form.name}
							onChange={(event) => updateField("name", event.target.value)}
							className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none ring-orange-500 transition focus:border-orange-400 focus:ring"
							placeholder="Ex: Wireless Mouse"
						/>
						{errors.name ? (
							<p className="mt-1 text-xs text-rose-600">{errors.name}</p>
						) : null}
					</div>

					<div>
						<label className="mb-1.5 block text-sm font-medium text-stone-700" htmlFor="price">
							Price
						</label>
						<input
							id="price"
							type="number"
							min="0"
							step="0.01"
							value={form.price}
							onChange={(event) => updateField("price", event.target.value)}
							className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none ring-orange-500 transition focus:border-orange-400 focus:ring"
							placeholder="99.99"
						/>
						{errors.price ? (
							<p className="mt-1 text-xs text-rose-600">{errors.price}</p>
						) : null}
					</div>

					<div>
						<label
							className="mb-1.5 block text-sm font-medium text-stone-700"
							htmlFor="description"
						>
							Description
						</label>
						<textarea
							id="description"
							rows={4}
							value={form.description}
							onChange={(event) => updateField("description", event.target.value)}
							className="w-full resize-none rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none ring-orange-500 transition focus:border-orange-400 focus:ring"
							placeholder="Short product description"
						/>
						{errors.description ? (
							<p className="mt-1 text-xs text-rose-600">{errors.description}</p>
						) : null}
					</div>

					<div>
						<label className="mb-1.5 block text-sm font-medium text-stone-700" htmlFor="imageUrl">
							Image URL (optional)
						</label>
						<input
							id="imageUrl"
							type="url"
							value={form.imageUrl ?? ""}
							onChange={(event) => updateField("imageUrl", event.target.value)}
							className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none ring-orange-500 transition focus:border-orange-400 focus:ring"
							placeholder="https://example.com/product.jpg"
						/>
						{errors.imageUrl ? (
							<p className="mt-1 text-xs text-rose-600">{errors.imageUrl}</p>
						) : null}
					</div>

					<div className="flex items-center justify-end gap-2 pt-2">
						<button
							type="button"
							onClick={onClose}
							className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
						>
							{mode === "create" ? "Add Product" : "Save Changes"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
