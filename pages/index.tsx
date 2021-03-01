import { GetServerSideProps, NextPage } from 'next';
import Layout from '../components/Layout';

interface Props {
	launch: {
		mission: string;
		site: string;
		timestamp: number;
		rocket: string;
	};
}

const IndexPage: NextPage<Props> = ({ launch }) => {
	const date = new Date(launch.timestamp);
	return (
		<Layout keywords="sdasdas">
			<main>
				<h1>Next SpaceX Launch: {launch.mission}</h1>
				<p>
					{launch.rocket} will take off from {launch.site} on {date.toDateString()}
				</p>
			</main>
		</Layout>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
	const response = await fetch('https://api.spacexdata.com/v3/launches/next');
	const nextLaunch = await response.json();

	return {
		props: {
			launch: {
				mission: nextLaunch.mission_name,
				site: nextLaunch.launch_site.site_name_long,
				timestamp: nextLaunch.launch_date_unix * 1000,
				rocket: nextLaunch.rocket.rocket_name
			}
		}
	};
};

export default IndexPage;
