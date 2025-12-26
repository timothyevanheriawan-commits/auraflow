// app/categories/page.tsx
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Plus, TrendingUp, TrendingDown } from 'lucide-react'
import AddCategoryModal from '@/components/categories/add-category-modal'
import CategoryCard from '@/components/cards/category-card'

// System categories that cannot be deleted
const SYSTEM_CATEGORIES = ['Uncategorized', 'Transfer']

export default async function CategoriesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Fetch categories with transaction counts
    const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .order('name')

    // Separate by type
    const incomeCategories = categories?.filter(c => c.type === 'income') || []
    const expenseCategories = categories?.filter(c => c.type === 'expense') || []

    const totalCategories = categories?.length || 0

    return (
        <div className="min-h-screen bg-background text-foreground">
            <main className="mx-auto max-w-3xl px-6 py-8">
                {/* Header */}
                <header className="mb-8 flex items-start justify-between">
                    <div>
                        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
                            Categories
                        </h1>
                        <p className="mt-1 text-sm text-tertiary">
                            {totalCategories} categor{totalCategories !== 1 ? 'ies' : 'y'} configured
                        </p>
                    </div>

                    {/* Add Category Button - Opens Modal */}
                    <AddCategoryModal />
                </header>

                {/* Categories Lists */}
                {totalCategories > 0 ? (
                    <div className="space-y-8">
                        {/* Income Categories */}
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-positive/10">
                                    <TrendingUp size={12} className="text-positive" />
                                </div>
                                <h2 className="text-sm font-semibold text-foreground">
                                    Income Categories
                                </h2>
                                <span className="text-xs text-tertiary data-text">
                                    ({incomeCategories.length})
                                </span>
                            </div>

                            {incomeCategories.length > 0 ? (
                                <div className="space-y-2">
                                    {incomeCategories.map((category) => (
                                        <CategoryCard
                                            key={category.id}
                                            category={category}
                                            isSystem={SYSTEM_CATEGORIES.includes(category.name)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <EmptyCategorySection type="income" />
                            )}
                        </section>

                        {/* Expense Categories */}
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-negative/10">
                                    <TrendingDown size={12} className="text-negative" />
                                </div>
                                <h2 className="text-sm font-semibold text-foreground">
                                    Expense Categories
                                </h2>
                                <span className="text-xs text-tertiary data-text">
                                    ({expenseCategories.length})
                                </span>
                            </div>

                            {expenseCategories.length > 0 ? (
                                <div className="space-y-2">
                                    {expenseCategories.map((category) => (
                                        <CategoryCard
                                            key={category.id}
                                            category={category}
                                            isSystem={SYSTEM_CATEGORIES.includes(category.name)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <EmptyCategorySection type="expense" />
                            )}
                        </section>
                    </div>
                ) : (
                    <EmptyState />
                )}
            </main>
        </div>
    )
}

// Empty Category Section
function EmptyCategorySection({ type }: { type: 'income' | 'expense' }) {
    return (
        <div className="py-6 px-4 rounded-xl border border-dashed border-border bg-surface/30 text-center">
            <p className="text-sm text-tertiary">
                No {type} categories yet
            </p>
        </div>
    )
}

// Empty State Component
function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-6 rounded-xl border border-dashed border-border bg-surface/50">
            <div className="w-12 h-12 rounded-xl border border-border bg-elevated/50 flex items-center justify-center mb-4">
                <Plus size={20} className="text-tertiary" />
            </div>
            <p className="text-sm font-medium text-muted mb-1">
                No categories yet
            </p>
            <p className="text-xs text-tertiary text-center max-w-[280px] mb-4">
                Create categories to organize your income and expenses for better tracking
            </p>
        </div>
    )
}