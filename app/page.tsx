"use client";

import { useEffect, useMemo, useState } from "react";
import { Toaster, toast } from "sonner";
import ProductCard from "@/app/components/ProductCard";
import ProductDialog from "@/app/components/ProductDialog";
import {
  loadProductsFromStorage,
  saveProductsToStorage,
  type Product,
} from "@/app/lib/product";

type DialogState = {
  open: boolean;
  mode: "create" | "edit";
  product: Product | null;
};

const INITIAL_DIALOG_STATE: DialogState = {
  open: false,
  mode: "create",
  product: null,
};

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState<DialogState>(INITIAL_DIALOG_STATE);

  useEffect(() => {
    setProducts(loadProductsFromStorage());
  }, []);

  useEffect(() => {
    saveProductsToStorage(products);
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return products;
    }

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query),
    );
  }, [products, search]);

  function openCreateDialog() {
    setDialog({ open: true, mode: "create", product: null });
  }

  function openEditDialog(product: Product) {
    setDialog({ open: true, mode: "edit", product });
  }

  function closeDialog() {
    setDialog(INITIAL_DIALOG_STATE);
  }

  function handleCreate(payload: {
    name: string;
    price: number;
    description: string;
    imageUrl?: string;
  }) {
    const newProduct: Product = {
      id: crypto.randomUUID(),
      name: payload.name,
      price: payload.price,
      description: payload.description,
      imageUrl: payload.imageUrl,
      createdAt: new Date().toISOString(),
    };

    setProducts((previous) => [newProduct, ...previous]);
    toast.success("Product added successfully");
  }

  function handleEdit(payload: {
    name: string;
    price: number;
    description: string;
    imageUrl?: string;
  }) {
    if (!dialog.product) {
      return;
    }

    setProducts((previous) =>
      previous.map((item) =>
        item.id === dialog.product?.id
          ? {
              ...item,
              name: payload.name,
              price: payload.price,
              description: payload.description,
              imageUrl: payload.imageUrl,
            }
          : item,
      ),
    );

    toast.success("Product updated");
  }

  function handleDelete(productId: string) {
    const candidate = products.find((item) => item.id === productId);
    if (!candidate) {
      return;
    }

    const confirmed = window.confirm(`Delete "${candidate.name}"?`);
    if (!confirmed) {
      return;
    }

    setProducts((previous) => previous.filter((item) => item.id !== productId));
    toast.success("Product deleted");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 via-orange-50/30 to-stone-100 px-4 py-10 sm:px-6">
      <Toaster richColors position="top-right" />

      <section className="mx-auto w-full max-w-6xl">
        <header className="mb-8 rounded-2xl border border-stone-200 bg-white/95 p-6 shadow-sm backdrop-blur sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
                Product Management
              </p>
              <h1 className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">
                Dashboard
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-stone-600">
                Add, edit, and manage product data with local persistence.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateDialog}
              className="rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
            >
              Add Product
            </button>
          </div>

          <div className="mt-6">
            <label htmlFor="search" className="mb-1.5 block text-sm font-medium text-stone-700">
              Search products
            </label>
            <input
              id="search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm outline-none ring-orange-500 transition placeholder:text-stone-400 focus:border-orange-400 focus:ring"
              placeholder="Search by name or description"
            />
          </div>
        </header>

        {filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center text-sm text-stone-600">
            {products.length === 0
              ? "No products yet. Add your first product to get started."
              : "No products match your search."}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={openEditDialog}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>

      <ProductDialog
        open={dialog.open}
        mode={dialog.mode}
        initialProduct={dialog.product}
        onClose={closeDialog}
        onSubmit={dialog.mode === "create" ? handleCreate : handleEdit}
      />
    </main>
  );
}