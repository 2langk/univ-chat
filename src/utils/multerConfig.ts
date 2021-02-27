import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';
import { Request } from 'express';
import AppError from './AppError';

AWS.config.update({
	region: 'ap-northeast-2',
	accessKeyId: process.env.AWS_S3_ID,
	secretAccessKey: process.env.AWS_S3_SECRET
});

const imageFilter = (
	req: Request,
	file: Express.Multer.File,
	cb: multer.FileFilterCallback
) => {
	if (file.mimetype.startsWith('image')) {
		cb(null, true);
	} else {
		cb(new AppError('Please upload only images.', 400));
	}
};

const videoOrImageFilter = (
	req: Request,
	file: Express.Multer.File,
	cb: multer.FileFilterCallback
) => {
	if (file.mimetype.startsWith('video') || file.mimetype.startsWith('image')) {
		cb(null, true);
	} else {
		cb(new AppError('Please upload only video or image.', 400));
	}
};

// eslint-disable-next-line import/prefer-default-export
export const uploadPledgeImages = multer({
	storage: multerS3({
		s3: new AWS.S3(),
		bucket: '2langk-s3-bucket/democracy-app/public/image',
		acl: 'public-read',
		key(req, file, cb) {
			cb(null, `pledgeImage-${Date.now()}.${file.mimetype.split('/')[1]}`);
		}
	}),
	fileFilter: imageFilter,
	limits: { fileSize: 10 * 1024 * 1024 }
});

export const uploadApplyImages = multer({
	storage: multerS3({
		s3: new AWS.S3(),
		bucket: '2langk-s3-bucket/democracy-app/public/image',
		acl: 'public-read',
		key(req, file, cb) {
			cb(null, `applyImage-${Date.now()}.${file.mimetype.split('/')[1]}`);
		}
	}),
	fileFilter: imageFilter,
	limits: { fileSize: 10 * 1024 * 1024 }
});

export const uploadUserPhoto = multer({
	storage: multerS3({
		s3: new AWS.S3(),
		bucket: '2langk-s3-bucket/democracy-app/public/photo',
		acl: 'public-read',
		key(req, file, cb) {
			cb(null, `userPhoto-${Date.now()}.${file.mimetype.split('/')[1]}`);
		}
	}),
	fileFilter: imageFilter,
	limits: { fileSize: 10 * 1024 * 1024 }
});

export const uploadPostFile = multer({
	storage: multerS3({
		s3: new AWS.S3(),
		bucket: '2langk-s3-bucket/democracy-app/public/posts',
		acl: 'public-read',
		key(req, file, cb) {
			cb(
				null,
				`${file.mimetype.split('/')[0]}-${Date.now()}.${
					file.mimetype.split('/')[1]
				}`
			);
		}
	}),
	fileFilter: videoOrImageFilter,
	limits: { fileSize: 500 * 1024 * 1024 }
});
