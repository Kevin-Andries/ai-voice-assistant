import { Router } from 'express';
import { askAssistant } from '../controllers/controller.js';
import multer from 'multer';
import path from 'path';
import { v4 } from 'uuid';

const router = Router();
const multerUploadAudioFile = multer({
    limits: {
        // 5 mb
        fileSize: 5 * 1048576,
    },
    storage: multer.diskStorage({
        destination: (_req, _file, cb) => {
            cb(null, '../uploadedAudioFiles/');
        },
        filename: (_req, file, cb) => {
            cb(null, v4() + path.extname(file.originalname));
        },
    }),
});

router.post(
    '/assistant',
    multerUploadAudioFile.single('audioFile'),
    askAssistant
);

export default router;
