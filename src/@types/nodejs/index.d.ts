import { UserDoc } from '../../models/User';

declare global {
	namespace NodeJS {
		interface Global {
			login(): Promise<any>;
		}
	}
}
