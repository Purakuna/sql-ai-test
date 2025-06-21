import useSWR from 'swr';
import { defaultFetcher } from './fetcher'; 

export const useDiagram = () => {
    const diagram = useSWR('/api/diagram', defaultFetcher, { revalidateOnFocus: false, revalidateOnReconnect: false });
    
    return diagram;
}
