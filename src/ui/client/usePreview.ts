import useSWRMutation from "swr/mutation";

async function generatePreview(url: string, { arg }: { arg: string }) {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ sqlQuery: arg }),
    })
    return response.json();
  }

export const usePreview = () => {
    const mutation = useSWRMutation(
        `/api/preview`,
        generatePreview
    );
    
    return mutation;
}
