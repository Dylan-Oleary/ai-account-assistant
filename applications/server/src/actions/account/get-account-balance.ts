export async function getAccountBalance({
  id,
}: {
  id: string;
}): Promise<number> {
  return parseInt(id) + 500;
}
