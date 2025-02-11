import { useState, useEffect } from 'react';

export const useFetch = <T>(params: string): { data: T | null, loading: boolean, error: string | null } => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://jsonplaceholder.typicode.com/${params}`);
                if (!response.ok) {
                    throw new Error('Error en la carga de datos');
                }
                const result: T = await response.json();
                setData(result);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (params) {
            fetchData();
        }
    }, [params]);

    return { data, loading, error };
};
