import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminNav } from '@/components/AdminNav'
import { ImageUrlField } from '@/components/ImageUrlField'
import { saveProduct, deleteProduct } from '@/app/admin/actions'
import type { Product } from '@/lib/types'

const inputClass =
  'w-full bg-transparent border border-line rounded px-3 py-2 text-sm outline-none focus:border-bone-dim'
const labelClass = 'block text-xs text-bone-dim mb-1 uppercase tracking-wide'

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>
}) {
  const { edit } = await searchParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login?error=no_session')

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true })

  const editing = edit
    ? ((products ?? []) as Product[]).find((p) => p.id === edit)
    : null

  return (
    <main className="min-h-screen bg-bg text-bone p-6 md:p-10">
      <AdminNav current="/admin/products" />
      <h1 className="text-2xl font-bold mb-2">Products</h1>
      <p className="text-bone-dim text-sm mb-8">
        No checkout is wired up yet — &quot;Buy URL&quot; can point to an
        external store (Shopify, Printful, a payment link, etc). Leave it
        blank if you just want to show the item for now.
      </p>

      <div className="grid lg:grid-cols-[1fr_1fr] gap-10">
        <div className="space-y-3">
          {(products ?? []).length === 0 && (
            <p className="text-bone-dim text-sm">No products yet.</p>
          )}
          {(products as Product[] | null)?.map((p) => (
            <div
              key={p.id}
              className="border border-line rounded p-4 flex justify-between items-start gap-3"
            >
              <div>
                <p className="font-semibold">{p.name}</p>
                <p className="text-bone-dim text-xs mt-0.5">
                  {p.price_cents != null
                    ? `$${(p.price_cents / 100).toFixed(2)}`
                    : 'No price set'}{' '}
                  · {p.is_available ? 'Available' : 'Hidden'}
                </p>
              </div>
              <div className="flex gap-3 shrink-0">
                <a
                  href={`/admin/products?edit=${p.id}`}
                  className="text-bone-dim hover:text-bone text-sm"
                >
                  Edit
                </a>
                <form action={deleteProduct}>
                  <input type="hidden" name="id" value={p.id} />
                  <button
                    type="submit"
                    className="text-bone-dim hover:text-blood-bright text-sm"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>

        <form
          action={saveProduct}
          key={editing?.id ?? 'new'}
          className="border border-line rounded p-6 space-y-4 h-fit"
        >
          <h2 className="font-semibold mb-2">
            {editing ? `Edit: ${editing.name}` : 'Add a product'}
          </h2>
          {editing && <input type="hidden" name="id" value={editing.id} />}

          <div>
            <label className={labelClass}>Name</label>
            <input
              name="name"
              defaultValue={editing?.name}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Price (USD)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="price"
              defaultValue={
                editing?.price_cents != null
                  ? (editing.price_cents / 100).toFixed(2)
                  : ''
              }
              placeholder="35.00"
              className={inputClass}
            />
          </div>

          <ImageUrlField
            name="image_url"
            label="Product image"
            defaultValue={editing?.image_url ?? ''}
          />

          <div>
            <label className={labelClass}>Buy URL (optional for now)</label>
            <input
              name="buy_url"
              defaultValue={editing?.buy_url ?? ''}
              className={inputClass}
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="is_available"
              defaultChecked={editing?.is_available ?? true}
            />
            Available (visible on the live site)
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="bg-blood hover:bg-blood-bright transition-colors px-5 py-2.5 rounded text-sm font-semibold"
            >
              {editing ? 'Save changes' : 'Add product'}
            </button>
            {editing && (
              <a
                href="/admin/products"
                className="px-5 py-2.5 rounded text-sm border border-line hover:border-bone-dim"
              >
                Cancel
              </a>
            )}
          </div>
        </form>
      </div>
    </main>
  )
}
