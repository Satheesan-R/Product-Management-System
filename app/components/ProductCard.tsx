"use client";

import { formatCurrency, type Product } from "@/app/lib/product";
import styles from "./ProductCard.module.css";

type ProductCardProps = {
	product: Product;
	onEdit: (product: Product) => void;
	onDelete: (productId: string) => void;
};

export default function ProductCard({
	product,
	onEdit,
	onDelete,
}: ProductCardProps) {
	return (
		<article className={styles.card}>
			<div className={styles.imageWrap}>
				{product.imageUrl ? (
					// Using a native img here keeps image URL flexibility without additional config.
					<img
						src={product.imageUrl}
						alt={product.name}
						className={styles.image}
					/>
				) : (
					<div className={styles.placeholder}>
						No image
					</div>
				)}
			</div>

			<div className={styles.content}>
				<div className={styles.titleRow}>
					<h3 className={styles.title}>{product.name}</h3>
					<p className={styles.price}>
						{formatCurrency(product.price)}
					</p>
				</div>

				<p className={styles.description}>
					{product.description}
				</p>

				<div className={styles.actions}>
					<button
						type="button"
						onClick={() => onEdit(product)}
						className={styles.editButton}
					>
						Edit
					</button>
					<button
						type="button"
						onClick={() => onDelete(product.id)}
						className={styles.deleteButton}
					>
						Delete
					</button>
				</div>
			</div>
		</article>
	);
}

