import multer from 'multer'
import crypto from 'crypto'
import path from 'path'
import { Request } from 'express'

export default {
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, '..', '..', 'tmp'),
        filename (req: Request, file, callback: Function) {
            const hash = crypto.randomBytes(6).toString('hex')

            const filename = `${hash}-${file.originalname}`

            callback(null, filename)
        }
    }),
    fileFilter: (req: Request, file: Express.Multer.File, cb:Function) => {
        const allowedMimes = [
            "image/jpeg",
            "image/pjpeg",
            "image/png",
            "image/gif"
        ];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type."));
        }
    }
}