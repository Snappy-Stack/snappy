import type { Access, FieldAccess } from 'payload'

export const isAdmin: Access = ({ req: { user } }) => {
 // Return true if user is logged in and has the super-admin role
 return Boolean((user as any)?.roles?.includes('super-admin'))
}

export const isAdminOrEditor: Access = ({ req: { user } }) => {
 // Return true if user is logged in and is either super-admin or editor
 return Boolean((user as any)?.roles?.includes('super-admin') || (user as any)?.roles?.includes('editor'))
}

export const isViewer: Access = ({ req: { user } }) => {
 // Return true if user is logged in (has any role)
 return Boolean(user)
}

export const isAdminFieldLevel: FieldAccess = ({ req: { user } }) => {
 return Boolean((user as any)?.roles?.includes('super-admin'))
}

export const isAdminOrEditorFieldLevel: FieldAccess = ({ req: { user } }) => {
 return Boolean((user as any)?.roles?.includes('super-admin') || (user as any)?.roles?.includes('editor'))
}
