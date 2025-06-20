import useSWRMutation from "swr/mutation";
import { defaultFetcher } from "./fetcher";

export const useHint = (requirement: string) => {
    const mutation = useSWRMutation(
        `/api/hint?requirement=${requirement}`,
        defaultFetcher
    );
    
    return mutation;
}
