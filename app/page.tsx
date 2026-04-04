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

type Theme = "light" | "dark";

const INITIAL_DIALOG_STATE: DialogState = {
  open: false,
  mode: "create",
  product: null,
};

const THEME_STORAGE_KEY = "product-management-theme";

export default function Page() {
  const [products, setProducts] = useState<Product[]>(() =>
    typeof window === "undefined" ? [] : loadProductsFromStorage(),
  );
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState<DialogState>(INITIAL_DIALOG_STATE);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    saveProductsToStorage(products);
  }, [products]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

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

  const totalValue = useMemo(
    () => products.reduce((sum, product) => sum + product.price, 0),
    [products],
  );

  function openCreateDialog() {
    setDialog({ open: true, mode: "create", product: null });
  }

  function openEditDialog(product: Product) {
    setDialog({ open: true, mode: "edit", product });
  }

  function closeDialog() {
    setDialog(INITIAL_DIALOG_STATE);
  }

  function toggleTheme() {
    setTheme((previous) => (previous === "dark" ? "light" : "dark"));
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
    <main className="min-h-screen bg-[#050816] px-4 py-6 text-slate-100 transition-colors sm:px-6 lg:px-8">
      <Toaster richColors position="top-right" />

      <section className="mx-auto grid w-full max-w-7xl gap-6 xl:grid-cols-[minmax(0,1fr)_440px]">
        <div className="space-y-6">
          <header className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#0d1324] via-[#11182d] to-[#1b2140] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:p-8">
            <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_top_right,rgba(167,139,250,0.28),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.2),transparent_30%)]" />
            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-200">
                  Operational status: optimal
                </p>
                <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl">
                  Product Command
                  <span className="block text-indigo-200">Center</span>
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  Unified product orchestration for the assessment. Real-time tracking,
                  inventory intelligence, and local-first product management in one view.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={openCreateDialog}
                    className="rounded-full bg-indigo-200 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-indigo-100"
                  >
                    + Add New Product
                  </button>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    {theme === "dark" ? "Light" : "Dark"} Mode
                  </button>
                </div>
              </div>

              <div className="grid min-w-0 gap-3 sm:grid-cols-3 lg:w-[420px] lg:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Total Products
                  </p>
                  <p className="mt-3 text-3xl font-black text-white">{products.length}</p>
                  <p className="mt-2 text-xs text-slate-400">Local inventory entries</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Value
                  </p>
                  <p className="mt-3 text-3xl font-black text-white">
                    {totalValue.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <p className="mt-2 text-xs text-slate-400">Current catalog worth</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Search
                  </p>
                  <p className="mt-3 text-3xl font-black text-white">{filteredProducts.length}</p>
                  <p className="mt-2 text-xs text-slate-400">Filtered results</p>
                </div>
              </div>
            </div>
          </header>

          <div className="rounded-[28px] border border-white/10 bg-[#0b1020] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.3)] sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Latest Products</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Curated additions to the product registry.
                </p>
              </div>
              <div className="w-full max-w-xs">
                <input
                  id="search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-300/50 focus:ring-2 focus:ring-indigo-300/20"
                  placeholder="Search by name or description"
                />
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-10 text-center text-sm text-slate-300">
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
          </div>
        </div>

        <div className="hidden xl:block">
          
                       
          </div>
        
      </section>

      {dialog.open ? (
        <ProductDialog
          key={`${dialog.mode}-${dialog.product?.id ?? "new"}`}
          open={dialog.open}
          mode={dialog.mode}
          initialProduct={dialog.product}
          onClose={closeDialog}
          onSubmit={dialog.mode === "create" ? handleCreate : handleEdit}
        />
      ) : null}
    </main>
  );
}