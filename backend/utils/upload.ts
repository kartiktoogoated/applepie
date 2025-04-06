import multer from 'multer';
import path from 'path';

// Set up storage options for Multer
const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, '/uploads');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    },
});

export const upload = multer ({ storage });