import { exec } from 'child_process';
import * as dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import express from 'express';
import multer from 'multer';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import router from './routers/router.js';

const app = express();

exec('mkdir ../uploadedAudioFiles && mkdir ../public');

// Midlewares
app.use(express.static('../public'));
app.use(helmet());
// 5 requests per minute
const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
});
app.use(limiter);
app.use(cors());

// Routers
app.use('/', router);

// Error handler
app.use('*', (err, req, res, next) => {
    console.log('ERROR:', err);

    if (err instanceof multer.MulterError) {
        // handle Multer error
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File too large' });
        }
    }
});

export default app;
