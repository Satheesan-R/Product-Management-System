"use client";

import { useMemo, useRef, useState } from "react";
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
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [form, setForm] = useState<ProductFormInput>(() => {
		if (mode === "edit" && initialProduct) {
			return {
				name: initialProduct.name,
				price: String(initialProduct.price),
				description: initialProduct.description,
				imageUrl: initialProduct.imageUrl ?? "",
			};
		}

		return EMPTY_FORM;
	});
	const [errors, setErrors] = useState<FormErrors>({});

	const title = mode === "create" ? "Add Product" : "Edit Product";
	const imagePreview = useMemo(() => {
		if (!form.imageUrl) {
			return null;
		}

		return form.imageUrl;
	}, [form.imageUrl]);

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

	function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
		const selectedFile = event.target.files?.[0];
		if (!selectedFile) {
			return;
		}

		const reader = new FileReader();
		reader.onload = () => {
			if (typeof reader.result === "string") {
				updateField("imageUrl", reader.result);
			}
		};
		reader.readAsDataURL(selectedFile);
	}

	function openFilePicker() {
		fileInputRef.current?.click();
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
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8"
			role="dialog"
			aria-modal="true"
			aria-label={title}
		>
			<div className="w-full max-w-xl rounded-[28px] border border-slate-700/70 bg-[#111827] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
				<div className="mb-6 flex items-start justify-between gap-4">
					<div>
						<p className="text-xs font-black uppercase tracking-[0.3em] text-indigo-300">
							Product Form
						</p>
						<h2 className="mt-2 text-2xl font-semibold text-slate-50">{title}</h2>
						<p className="mt-2 text-sm text-slate-400">
							Match the reference layout with a clean dark presentation.
						</p>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="rounded-full p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
						aria-label="Close dialog"
					>
						X
					</button>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-indigo-300" htmlFor="name">
							Product Name
						</label>
						<input
							id="name"
							type="text"
							value={form.name}
							onChange={(event) => updateField("name", event.target.value)}
							className="w-full rounded-lg border border-slate-700 bg-[#343d57] px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
							placeholder="e.g. Quantum Pro Processor"
						/>
						{errors.name ? (
							<p className="mt-1 text-xs text-rose-400">{errors.name}</p>
						) : null}
					</div>

					<div className="grid gap-4 sm:grid-cols-2">
						<div>
							<label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-indigo-300" htmlFor="price">
								Price (USD)
							</label>
							<input
								id="price"
								type="number"
								min="0"
								step="0.01"
								value={form.price}
								onChange={(event) => updateField("price", event.target.value)}
								className="w-full rounded-lg border border-slate-700 bg-[#343d57] px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
								placeholder="0.00"
							/>
							{errors.price ? (
								<p className="mt-1 text-xs text-rose-400">{errors.price}</p>
							) : null}
						</div>

						<div>
							<label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-indigo-300" htmlFor="category">
								Category
							</label>
							<div className="flex items-center rounded-lg border border-slate-700 bg-[#343d57] px-4 py-3 text-sm text-slate-200">
								<span className="flex-1">Electronics</span>
								<span className="text-slate-400">⌄</span>
							</div>
							<p className="mt-1 text-xs text-slate-500">Category shown to match the reference layout.</p>
						</div>
					</div>

					<div>
						<label
							className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-indigo-300"
							htmlFor="description"
						>
							Description
						</label>
						<textarea
							id="description"
							rows={4}
							value={form.description}
							onChange={(event) => updateField("description", event.target.value)}
							className="w-full resize-none rounded-lg border border-slate-700 bg-[#343d57] px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
							placeholder="Describe the technical specifications and product intent..."
						/>
						{errors.description ? (
							<p className="mt-1 text-xs text-rose-400">{errors.description}</p>
						) : null}
					</div>

					<div>
						<label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-indigo-300">
							Product Imagery
						</label>
						<input
							ref={fileInputRef}
							type="file"
							accept="image/png,image/jpeg,image/jpg"
							className="sr-only"
							onChange={handleFileSelect}
						/>
						<button
							type="button"
							onClick={openFilePicker}
							className="flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-500 bg-[#343d57] px-6 py-10 text-center text-slate-200 transition hover:border-indigo-400 hover:bg-[#3a4561]"
						>
							<div className="mb-4 text-4xl text-slate-300">☁</div>
							<p className="text-base font-semibold">Drag and drop assets here</p>
							<p className="mt-1 text-sm text-slate-400">PNG, JPG up to 10MB</p>
							<span className="mt-4 text-sm font-semibold text-indigo-300 underline underline-offset-4">
								Browse files
							</span>
						</button>
						<div className="mt-3">
							<label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-indigo-300" htmlFor="imageUrl">
								Image URL (optional)
							</label>
							<input
								id="imageUrl"
								type="url"
								value={form.imageUrl ?? ""}
								onChange={(event) => updateField("imageUrl", event.target.value)}
								className="w-full rounded-lg border border-slate-700 bg-[#343d57] px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
								placeholder="https://example.com/product.jpg"
							/>
							{errors.imageUrl ? (
								<p className="mt-1 text-xs text-rose-400">{errors.imageUrl}</p>
							) : null}
						</div>
						{imagePreview ? (
							<div className="mt-4 overflow-hidden rounded-2xl border border-slate-700 bg-[#1f2937]">
								<img src={imagePreview} alt="Preview" className="h-48 w-full object-cover" />
							</div>
						) : null}
					</div>

					<div className="flex items-center justify-end gap-3 pt-2">
						<button
							type="button"
							onClick={onClose}
							className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600"
						>
							{mode === "create" ? "Add Product" : "Save Changes"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
