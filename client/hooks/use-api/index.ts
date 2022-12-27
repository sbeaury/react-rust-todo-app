export async function useApi({ url }: { url: string }) {
  const response = await fetch(url);
  const { status: statusCode } = response;
  const data = await response.json();

  return {
    statusCode,
    data,
  };
}
