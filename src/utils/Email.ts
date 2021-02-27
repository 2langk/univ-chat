import * as nodemailer from 'nodemailer';
import * as ejs from 'ejs';
import { User } from '../models';

export default class Email {
	public to: string;

	public name: string;

	public school: string;

	public from: string;

	constructor(user: User) {
		this.to = user.email;
		this.name = user.name;
		this.school = user.school;
		this.from = `Democra;SEE-관리자`;
	}

	// eslint-disable-next-line class-methods-use-this
	transporter(): nodemailer.Transporter {
		return nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.GMAIL_ID, // gmail 계정 아이디를 입력
				pass: process.env.GMAIL_PASSWORD // gmail 계정의 비밀번호를 입력
			}
		});
	}

	async sendWelcome(): Promise<any> {
		const html = await ejs.renderFile('./email/welcome.ejs', {
			school: this.name
		});

		const mailOptions = {
			from: this.from,
			to: this.to,
			subject: '<Democra; SEE> 회원가입 신청이 승인 되었습니다',
			text: 'Hello',
			html
		};

		await this.transporter().sendMail(mailOptions);
	}
}
