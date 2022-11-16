export const isNullOrEmptyString = (value: string) => {
  return value === null || value === undefined || value.trim().length === 0
}
