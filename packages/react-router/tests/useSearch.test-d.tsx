import { expectTypeOf, test } from 'vitest'
import {
  type FullSearchSchema,
  createRootRoute,
  createRoute,
  createRouter,
  useSearch,
} from '../src'

test('when there are no search params', () => {
  const rootRoute = createRootRoute()

  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
  })

  const invoicesRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: 'invoices',
  })

  const invoicesIndexRoute = createRoute({
    getParentRoute: () => invoicesRoute,
    path: '/',
  })

  const invoiceRoute = createRoute({
    getParentRoute: () => invoicesRoute,
    path: '$invoiceId',
  })

  const routeTree = rootRoute.addChildren([
    invoicesRoute.addChildren([invoicesIndexRoute, invoiceRoute]),
    indexRoute,
  ])

  const defaultRouter = createRouter({
    routeTree,
  })

  type DefaultRouter = typeof defaultRouter

  expectTypeOf(useSearch<DefaultRouter['routeTree']>)
    .parameter(0)
    .toHaveProperty('from')
    .toEqualTypeOf<
      '/invoices' | '__root__' | '/invoices/$invoiceId' | '/invoices/' | '/'
    >()

  expectTypeOf(useSearch<DefaultRouter['routeTree']>)
    .parameter(0)
    .toHaveProperty('strict')
    .toEqualTypeOf<true | undefined>()

  expectTypeOf(useSearch<DefaultRouter['routeTree'], '/'>)
    .parameter(0)
    .toHaveProperty('select')
    .parameter(0)
    .toEqualTypeOf<{}>()

  expectTypeOf(useSearch<DefaultRouter['routeTree'], '/'>)
    .parameter(0)
    .toHaveProperty('select')
    .returns.toEqualTypeOf<{}>()

  expectTypeOf(
    useSearch<DefaultRouter['routeTree'], '/'>,
  ).returns.toEqualTypeOf<{}>()

  expectTypeOf(
    useSearch<DefaultRouter['routeTree'], '/', false>({ strict: false }),
  ).toEqualTypeOf<{}>()
})

test('when there is one search params', () => {
  const rootRoute = createRootRoute()

  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
  })

  const invoicesRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: 'invoices',
    validateSearch: () => ({ page: 0 }),
  })

  const invoicesIndexRoute = createRoute({
    getParentRoute: () => invoicesRoute,
    path: '/',
  })

  const invoiceRoute = createRoute({
    getParentRoute: () => invoicesRoute,
    path: '$invoiceId',
  })

  const routeTree = rootRoute.addChildren([
    invoicesRoute.addChildren([invoicesIndexRoute, invoiceRoute]),
    indexRoute,
  ])

  const defaultRouter = createRouter({
    routeTree,
  })

  type DefaultRouter = typeof defaultRouter

  expectTypeOf(
    useSearch<DefaultRouter['routeTree'], '/'>,
  ).returns.toEqualTypeOf<{}>()

  expectTypeOf(
    useSearch<DefaultRouter['routeTree'], '/invoices'>,
  ).returns.toEqualTypeOf<{ page: number }>()

  expectTypeOf(useSearch<DefaultRouter['routeTree'], '/invoices'>)
    .parameter(0)
    .toHaveProperty('select')
    .toEqualTypeOf<
      ((search: { page: number }) => { page: number }) | undefined
    >()

  expectTypeOf(
    useSearch<DefaultRouter['routeTree'], '/invoices', false>,
  ).returns.toEqualTypeOf<{ page?: number }>()

  expectTypeOf(useSearch<DefaultRouter['routeTree'], '/invoices', false>)
    .parameter(0)
    .toHaveProperty('select')
    .toEqualTypeOf<
      ((search: { page?: number }) => { page?: number }) | undefined
    >()

  expectTypeOf(
    useSearch<
      DefaultRouter['routeTree'],
      '/invoices',
      false,
      FullSearchSchema<DefaultRouter['routeTree']>,
      number
    >,
  ).returns.toEqualTypeOf<number>()
})

test('when there are multiple search params', () => {
  const rootRoute = createRootRoute()

  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
  })

  const invoicesRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: 'invoices',
    validateSearch: () => ({ page: 0 }),
  })

  const invoicesIndexRoute = createRoute({
    getParentRoute: () => invoicesRoute,
    path: '/',
  })

  const invoiceRoute = createRoute({
    getParentRoute: () => invoicesRoute,
    path: '$invoiceId',
    validateSearch: () => ({ detail: 'detail' }),
  })

  const routeTree = rootRoute.addChildren([
    invoicesRoute.addChildren([invoicesIndexRoute, invoiceRoute]),
    indexRoute,
  ])

  const defaultRouter = createRouter({
    routeTree,
  })

  type DefaultRouter = typeof defaultRouter

  expectTypeOf(
    useSearch<DefaultRouter['routeTree'], '/'>,
  ).returns.toEqualTypeOf<{}>()

  expectTypeOf(
    useSearch<DefaultRouter['routeTree'], '/invoices'>,
  ).returns.toEqualTypeOf<{ page: number }>()

  expectTypeOf(useSearch<DefaultRouter['routeTree'], '/invoices'>)
    .parameter(0)
    .toHaveProperty('select')
    .toEqualTypeOf<
      ((search: { page: number }) => { page: number }) | undefined
    >()

  expectTypeOf(
    useSearch<DefaultRouter['routeTree'], '/invoices', false>,
  ).returns.toEqualTypeOf<{ page?: number; detail?: string }>()

  expectTypeOf(useSearch<DefaultRouter['routeTree'], '/invoices', false>)
    .parameter(0)
    .toHaveProperty('select')
    .toEqualTypeOf<
      | ((search: { page?: number; detail?: string }) => {
          page?: number
          detail?: string
        })
      | undefined
    >()
})

test('when there are overlapping search params', () => {
  const rootRoute = createRootRoute()

  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
  })

  const invoicesRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: 'invoices',
    validateSearch: () => ({ page: 0 }),
  })

  const invoicesIndexRoute = createRoute({
    getParentRoute: () => invoicesRoute,
    path: '/',
    validateSearch: () => ({ detail: 50 }) as const,
  })

  const invoiceRoute = createRoute({
    getParentRoute: () => invoicesRoute,
    path: '$invoiceId',
    validateSearch: () => ({ detail: 'detail' }) as const,
  })

  const routeTree = rootRoute.addChildren([
    invoicesRoute.addChildren([invoicesIndexRoute, invoiceRoute]),
    indexRoute,
  ])

  const defaultRouter = createRouter({
    routeTree,
  })

  type DefaultRouter = typeof defaultRouter

  expectTypeOf(
    useSearch<DefaultRouter['routeTree'], '/'>,
  ).returns.toEqualTypeOf<{}>()

  expectTypeOf(
    useSearch<DefaultRouter['routeTree'], '/invoices'>,
  ).returns.toEqualTypeOf<{ page: number }>()

  expectTypeOf(useSearch<DefaultRouter['routeTree'], '/invoices'>)
    .parameter(0)
    .toHaveProperty('select')
    .toEqualTypeOf<
      ((search: { page: number }) => { page: number }) | undefined
    >()

  expectTypeOf(
    useSearch<DefaultRouter['routeTree'], '/invoices', false>,
  ).returns.toEqualTypeOf<{ page?: number; detail?: 'detail' | 50 }>()

  expectTypeOf(useSearch<DefaultRouter['routeTree'], '/invoices', false>)
    .parameter(0)
    .toHaveProperty('select')
    .toEqualTypeOf<
      | ((search: { page?: number; detail?: 'detail' | 50 }) => {
          page?: number
          detail?: 'detail' | 50
        })
      | undefined
    >()
})
