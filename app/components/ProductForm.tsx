"use client";

import { useMemo, useRef, useState } from "react";
import {
	productSchema,
	type Product,
	type ProductFormInput,
} from "@/app/lib/product";
import styles from "./ProductForm.module.css";

type ProductFormProps = {
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

export default function ProductForm({
	open,
	mode,
	initialProduct,
	onClose,
	onSubmit,
}: ProductFormProps) {
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
						<h2 className={styles.title}>{title}</h2>
						
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
							placeholder="e.g. Cosmetics products "
						/>
						{errors.name ? (
							<p className={styles.errorText}>{errors.name}</p>
						) : null}
					</div>

					<div className={styles.gridTwo}>
						<div>
							<label className={styles.fieldLabel} htmlFor="price">
								Price (RS)
							</label>
							<input
								id="price"
								type="number"
								min="0"
								step="1"
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

							<select id="category" className={styles.input}>
								<option value="">Select Category</option>
								<option value="electronics">Electronics</option>
								<option value="fashion">Fashion</option>
								<option value="home">Home & Living</option>
								<option value="beauty">Beauty & Personal Care</option>
								<option value="sports">Sports & Fitness</option>
								<option value="books">Books</option>
								<option value="toys">Toys & Games</option>
								<option value="grocery">Grocery</option>
								<option value="other">Others</option>
							</select>

							<p className={styles.staticFieldNote}>
								Choose a category for the product.
							</p>
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

					<div className={styles.imageSection}>
						<div className={styles.imageSectionHeader}>
							<label className={styles.fieldLabel}>Product Imagery</label>
							<p className={styles.staticFieldNote}>
								Add an image below using drag and drop or browse files.
							</p>
						</div>

						<div className={styles.imageUploadWrap}>
							<input
								ref={fileInputRef}
								type="file"
								accept="image/png,image/jpeg,image/jpg"
								className={styles.srOnly}
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
								<span className={styles.uploadLink}>Browse files</span>
							</button>
						</div>

						<div className={styles.imageUrlWrap}>
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
					</div>

					<div className={styles.actions}>
						<button
							type="submit"
							className={styles.submitButton}
						>
							{mode === "create" ? "Add Product" : "Save Changes"}
						</button>
						<button
							type="button"
							onClick={onClose}
							className={styles.cancelButton}
						>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
