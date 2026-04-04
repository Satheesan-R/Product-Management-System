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
import styles from "./page.module.css";

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
    <main className={styles.page}>
      <Toaster richColors position="top-right" />

      <section className={styles.shell}>
        <div className={styles.stack}>
          <header className={styles.hero}>
            <div className={styles.heroContent}>
              <div className={styles.heroText}>
                <p className={styles.eyebrow}>Operational status: optimal</p>
                <h1 className={styles.title}>
                  Product <span className={styles.titleAccent}>Center</span>
                </h1>
                <p className={styles.lead}>
                  Unified product orchestration for the assessment. Real-time tracking,
                  inventory intelligence, and local-first product management in one view.
                </p>
                <div className={styles.actions}>
                  <button
                    type="button"
                    onClick={openCreateDialog}
                    className={styles.buttonPrimary}
                  >
                    + Add New Product
                  </button>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className={styles.buttonSecondary}
                  >
                    {theme === "dark" ? "Light" : "Dark"} Mode
                  </button>
                </div>
              </div>

              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <p className={styles.statLabel}>
                    Total Products
                  </p>
                  <p className={styles.statValue}>{products.length}</p>
                  <p className={styles.statNote}>Local inventory entries</p>
                </div>
                <div className={styles.statCard}>
                  <p className={styles.statLabel}>
                    Value
                  </p>
                  <p className={styles.statValue}>
                    {totalValue.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <p className={styles.statNote}>Current catalog worth</p>
                </div>
                <div className={styles.statCard}>
                  <p className={styles.statLabel}>
                    Search
                  </p>
                  <p className={styles.statValue}>{filteredProducts.length}</p>
                  <p className={styles.statNote}>Filtered results</p>
                </div>
              </div>
            </div>
          </header>

          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <h2 className={styles.panelTitle}>Latest Products</h2>
                <p className={styles.panelDescription}>
                  Curated additions to the product registry.
                </p>
              </div>
              <div className={styles.searchWrap}>
                <input
                  id="search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className={styles.searchInput}
                  placeholder="Search by name or description"
                />
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className={styles.emptyState}>
                {products.length === 0
                  ? "No products yet. Add your first product to get started."
                  : "No products match your search."}
              </div>
            ) : (
              <div className={styles.productGrid}>
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