/** M:{ a: _, b: _, ... } => [{ prop: String, allowed: [_]], [M] -> M */
export function filterEntries(filters, xs) {
    return filters.reduce((xs, f) => {
        if (f.allowed.length === 0) { return xs }
        return xs.filter(x => f.allowed.indexOf(x[f.prop]) !== -1)
    }, xs)
}
