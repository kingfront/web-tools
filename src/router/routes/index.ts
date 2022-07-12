import type { RouteRecordNormalized } from 'vue-router';

const modules = import.meta.globEager('./modules/*.ts');

function formatModules(_modules: any, result: RouteRecordNormalized[]) {
  Object.keys(_modules).forEach((key) => {
    const defaultModule = _modules[key].default;
    if (!defaultModule) return;
    const moduleList = Array.isArray(defaultModule)
      ? [...defaultModule]
      : [defaultModule];
    result.push(...moduleList);
  });
  return result;
}

export const appRoutes: RouteRecordNormalized[] = formatModules(modules, []);

// Avoid circular references, put here

export const DEFAULT_ROUTE_NAME = 'DocsConvert';

export const DEFAULT_ROUTE = {
  title: 'menu.dashboard.docsConvert',
  name: DEFAULT_ROUTE_NAME,
  fullPath: '/dashboard/docsConvert',
};
