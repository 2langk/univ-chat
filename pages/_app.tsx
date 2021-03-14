/* eslint-disable */
import type { AppProps /* , AppContext */ } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import axios from 'axios';
import { SWRConfig } from 'swr';

axios.defaults.baseURL = 'http://localhost:4000';
axios.interceptors.request.use(
	(config) => {
		if (typeof window !== 'undefined') {
			const authToken = localStorage.getItem('jwt');
			if (authToken) {
				config.headers.Authorization = `Bearer ${authToken}`;
			}
		}
		return config;
	},
	(err) => Promise.reject(err)
);
axios.defaults.withCredentials = true;

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<SWRConfig value={{ fetcher }}>
			<ChakraProvider>
				<Component {...pageProps} />
			</ChakraProvider>
		</SWRConfig>
	);
}
export default MyApp;
