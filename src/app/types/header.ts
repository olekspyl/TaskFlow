export type HeaderTitleContext = {
  userName: string
}

export type HeaderTitleValue = string | ((context: HeaderTitleContext) => string)
