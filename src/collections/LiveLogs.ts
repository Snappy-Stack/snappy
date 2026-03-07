import { CollectionConfig } from 'payload'

export const LiveLogs: CollectionConfig = {
 slug: 'live-logs',
 access: {
 read: () => true,
 create: () => true,
 },
 fields: [
 {
 name: 'status',
 type: 'select',
 options: ['info', 'warning', 'error', 'success'],
 defaultValue: 'info',
 required: true,
 },
 {
 name: 'message',
 type: 'text',
 required: true,
 },
 {
 name: 'latencyMs',
 type: 'number',
 },
 ],
}
