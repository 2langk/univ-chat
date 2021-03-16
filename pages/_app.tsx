/* eslint-disable */
import type { AppProps /* , AppContext */ } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import axios from 'axios';
import { SWRConfig } from 'swr';

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
