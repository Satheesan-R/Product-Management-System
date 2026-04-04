"use client";

import { formatCurrency, type Product } from "@/app/lib/product";

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
		<article className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
			<div className="aspect-[16/9] w-full overflow-hidden bg-stone-100">
				{product.imageUrl ? (
					// Using a native img here keeps image URL flexibility without additional config.
					<img
						src={product.imageUrl}
						alt={product.name}
						className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center text-sm font-medium text-stone-500">
						No image
					</div>
				)}
			</div>

			<div className="space-y-3 p-5">
				<div className="flex items-start justify-between gap-3">
					<h3 className="text-lg font-semibold text-stone-900">{product.name}</h3>
					<p className="rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-700">
						{formatCurrency(product.price)}
					</p>
				</div>

				<p className="line-clamp-3 text-sm leading-6 text-stone-600">
					{product.description}
				</p>

				<div className="flex items-center gap-2 pt-1">
					<button
						type="button"
						onClick={() => onEdit(product)}
						className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
					>
						Edit
					</button>
					<button
						type="button"
						onClick={() => onDelete(product.id)}
						className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
					>
						Delete
					</button>
				</div>
			</div>
		</article>
	);
}

