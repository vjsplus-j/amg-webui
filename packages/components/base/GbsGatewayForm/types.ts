import type { BaseProps } from '@amg-webui/types'
export interface GbsGateway { gatewayId: string; sipDomain: string; sipPort: number; password: string; realm: string }
export interface GbsGatewayFormProps extends BaseProps { modelValue?: GbsGateway; disabled?: boolean }
export interface GbsGatewayFormEmits { (e: 'update:modelValue', v: GbsGateway): void; (e: 'submit', v: GbsGateway): void }
