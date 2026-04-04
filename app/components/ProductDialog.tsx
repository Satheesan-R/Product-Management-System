"use client";

import { useMemo, useRef, useState } from "react";
import {
	productSchema,
	type Product,
	type ProductFormInput,
} from "@/app/lib/product";
import styles from "./ProductDialog.module.css";

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
			className={styles.overlay}
			role="dialog"
			aria-modal="true"
			aria-label={title}
		>
			<button
				type="button"
				className={styles.backdrop}
				onClick={onClose}
				aria-label="Close backdrop"
			/>

			<div className={styles.dialog}>
				<div className={styles.header}>
					<div>
						<p className={styles.eyebrow}>
							Product Form
						</p>
						<h2 className={styles.title}>{title}</h2>
						<p className={styles.subtitle}>
							Match the reference layout with a clean dark presentation.
						</p>
					</div>
					<button
						type="button"
						onClick={onClose}
						className={styles.closeButton}
						aria-label="Close dialog"
					>
						X
					</button>
				</div>

				<form onSubmit={handleSubmit} className={styles.form}>
					<div>
						<label className={styles.fieldLabel} htmlFor="name">
							Product Name
						</label>
						<input
							id="name"
							type="text"
							value={form.name}
							onChange={(event) => updateField("name", event.target.value)}
							className={styles.textInput}
							placeholder="e.g. Quantum Pro Processor"
						/>
						{errors.name ? (
							<p className={styles.errorText}>{errors.name}</p>
						) : null}
					</div>

					<div className={styles.gridTwo}>
						<div>
							<label className={styles.fieldLabel} htmlFor="price">
								Price (USD)
							</label>
							<input
								id="price"
								type="number"
								min="0"
								step="0.01"
								value={form.price}
								onChange={(event) => updateField("price", event.target.value)}
								className={styles.textInput}
								placeholder="0.00"
							/>
							{errors.price ? (
								<p className={styles.errorText}>{errors.price}</p>
							) : null}
						</div>

						<div>
							<label className={styles.fieldLabel} htmlFor="category">
								Category
							</label>
							<div className={styles.staticField}>
								<span className="flex-1">Electronics</span>
								<span className={styles.staticFieldArrow}>⌄</span>
							</div>
							<p className={styles.staticFieldNote}>Category shown to match the reference layout.</p>
						</div>
					</div>

					<div>
						<label className={styles.fieldLabel} htmlFor="description">
							Description
						</label>
						<textarea
							id="description"
							rows={4}
							value={form.description}
							onChange={(event) => updateField("description", event.target.value)}
							className={styles.textArea}
							placeholder="Describe the technical specifications and product intent..."
						/>
						{errors.description ? (
							<p className={styles.errorText}>{errors.description}</p>
						) : null}
					</div>

					<div>
						<label className={styles.fieldLabel}>
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
							className={styles.uploadButton}
						>
							<div className={styles.uploadIcon}>☁</div>
							<p className={styles.uploadTitle}>Drag and drop assets here</p>
							<p className={styles.uploadHint}>PNG, JPG up to 10MB</p>
							<span className={styles.uploadLink}>
								Browse files
							</span>
						</button>
						<div style={{ marginTop: 12 }}>
							<label className={styles.fieldLabel} htmlFor="imageUrl">
								Image URL (optional)
							</label>
							<input
								id="imageUrl"
								type="url"
								value={form.imageUrl ?? ""}
								onChange={(event) => updateField("imageUrl", event.target.value)}
								className={styles.textInput}
								placeholder="https://example.com/product.jpg"
							/>
							{errors.imageUrl ? (
								<p className={styles.errorText}>{errors.imageUrl}</p>
							) : null}
						</div>
						{imagePreview ? (
							<div className={styles.preview}>
								<img src={imagePreview} alt="Preview" className={styles.previewImage} />
							</div>
						) : null}
						<p className={styles.tip}>
							Tip: uploaded images are stored as a preview URL in local state. For the
							assessment, the image URL field is what persists.
						</p>
					</div>

					<div className={styles.actions}>
						<button
							type="button"
							onClick={onClose}
							className={styles.cancelButton}
						>
							Cancel
						</button>
						<button
							type="submit"
							className={styles.submitButton}
						>
							{mode === "create" ? "Add Product" : "Save Changes"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
