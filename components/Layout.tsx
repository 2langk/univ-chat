import { ReactNode } from 'react';
import Meta from './Meta';

type LayoutProps = {
	children: ReactNode;
	title?: string;
	keywords?: string;
	description?: string;
};

const Header: React.VFC<unknown> = () => {
	return (
		<div>
			<h1 className="title">
				<span>Header</span> Title
			</h1>
			<p className="description">Header Content</p>
		</div>
	);
};

const Layoyut: React.FC<LayoutProps> = ({ children, title, keywords, description }) => {
	return (
		<>
			<Meta title={title} keywords={keywords} description={description} />
			<div className="container">
				<Header />
				<main className="main">{children}</main>
			</div>
		</>
	);
};

export default Layoyut;
