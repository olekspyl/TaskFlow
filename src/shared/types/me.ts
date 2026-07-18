import * as PermsTypes from './permissions'

export type Response = {
  email: string
  name: string
  role: PermsTypes.Roles
  permissions: string[]
  isAdmin: boolean
  createdAt: string
  updatedAt: string
}
