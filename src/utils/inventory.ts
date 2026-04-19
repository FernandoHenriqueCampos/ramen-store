const INVENTORY_STORAGE_KEY = 'ramen_inventory_records'
const DEFAULT_STOCK_FALLBACK = 20

type InventoryRecord = {
  stock: number
  minStock: number
}

function normalizeInventoryId(id: string): string {
  return id.startsWith('limited-release-') ? id.replace('limited-release-', '') : id
}

function parseInventoryRecords(raw: string | null): Record<string, InventoryRecord> {
  if (!raw) return {}

  try {
    const parsed = JSON.parse(raw) as Record<string, InventoryRecord>
    const normalized: Record<string, InventoryRecord> = {}

    Object.entries(parsed).forEach(([id, record]) => {
      if (
        record &&
        typeof record.stock === 'number' &&
        typeof record.minStock === 'number' &&
        record.stock >= 0 &&
        record.minStock >= 0
      ) {
        normalized[id] = {
          stock: Math.floor(record.stock),
          minStock: Math.floor(record.minStock),
        }
      }
    })

    return normalized
  } catch {
    return {}
  }
}

export function getInventoryRecords(): Record<string, InventoryRecord> {
  if (typeof window === 'undefined') return {}
  return parseInventoryRecords(localStorage.getItem(INVENTORY_STORAGE_KEY))
}

function persistInventoryRecords(records: Record<string, InventoryRecord>): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(records))
}

export function getItemStock(itemId: string): number {
  const normalizedId = normalizeInventoryId(itemId)
  const records = getInventoryRecords()
  const record = records[normalizedId]

  if (!record) return DEFAULT_STOCK_FALLBACK
  return Math.max(0, Math.floor(record.stock))
}

export function isOutOfStock(itemId: string): boolean {
  return getItemStock(itemId) <= 0
}

export function consumeInventoryForCartItems(items: Array<{ id: string; quantity: number }>): void {
  const records = getInventoryRecords()

  items.forEach((item) => {
    const normalizedId = normalizeInventoryId(item.id)
    const safeQuantity = Math.max(0, Math.floor(item.quantity))
    const currentStock = records[normalizedId]?.stock ?? DEFAULT_STOCK_FALLBACK
    const nextStock = Math.max(0, currentStock - safeQuantity)

    records[normalizedId] = {
      stock: nextStock,
      minStock: records[normalizedId]?.minStock ?? 5,
    }
  })

  persistInventoryRecords(records)
}
