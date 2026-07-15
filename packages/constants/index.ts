export const PACKAGE_NAME = 'amg-webui'
export const BUSINESS_MODULES = ['login', 'users', 'orders', 'content', 'settings'] as const
export type BusinessModuleName = (typeof BUSINESS_MODULES)[number]
