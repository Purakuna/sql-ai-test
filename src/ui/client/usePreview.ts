import useSWRMutation from "swr/mutation";
import { defaultFetcher } from "./fetcher";

export const usePreview = (query: string) => {
    const mutation = useSWRMutation(
        `/api/preview?sqlQuery=${query}`,
        defaultFetcher
    );
    
    return mutation;
}
