type DynamicRouter = {};

type StaticRouter = {};

type AppRouter = StaticRouter & DynamicRouter;

type StaticRoutes = keyof StaticRouter;
type DynamicRoutes = keyof DynamicRouter;

import { type z } from "zod";
import { type GetServerSidePropsContext } from "next";

type StaticRoute = {
  searchParams: undefined;
  routeParams: undefined;
};

type DynamicRoute = {
  searchParams: z.AnyZodObject | undefined;
  routeParams: z.AnyZodObject | undefined;
};

type InferRoute<T extends DynamicRoute> = {
  searchParams: HandleUndefined<T["searchParams"]>;
  routeParams: HandleUndefined<T["routeParams"]>;
};

export type PathOptions<T extends AllRoutes> = T extends StaticRoutes
  ? StaticPathOptions<T>
  : DynamicRouteOptions<T>;

type HandleUndefined<T extends z.AnyZodObject | undefined> =
  T extends z.AnyZodObject ? z.infer<T> : undefined;

type DynamicRouteOptions<T extends DynamicRoutes> = {
  route: T;
  searchParams?: SearchParams<T>;
  routeParams?: RouteParams<T>;
};

type StaticPathOptions<T extends StaticRoutes> = {
  route: T;
  searchParams?: undefined;
  routeParams?: undefined;
};

export type AllRoutes = keyof AppRouter;

type SearchParams<T extends AllRoutes> = AppRouter[T]["searchParams"];
type RouteParams<T extends AllRoutes> = AppRouter[T]["routeParams"];

declare function $path<T extends AllRoutes>({
  route,
  searchParams,
  routeParams,
}: PathOptions<T>): string;

declare function useRouteParams<T extends z.AnyZodObject>(
  validator: T
): UseParamsResult<T>;

declare function useSearchParams<T extends z.AnyZodObject>(
  searchValidator: T
): UseParamsResult<T>;

export type UseParamsResult<T extends z.AnyZodObject> =
  | {
      data: z.infer<T>;
      isValid: true;
      isReady: true;
      isError: false;
      error: undefined;
    }
  | {
      data: undefined;
      isValid: false;
      isReady: true;
      isError: true;
      error: z.ZodError<T>;
    }
  | {
      data: undefined;
      isValid: false;
      isReady: false;
      isError: false;
      error: undefined;
    };

export { $path, useRouteParams, useSearchParams };
