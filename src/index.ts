import express, { Request, Response } from 'express';
import { AppDataSource } from './connection.DataSource';
import { ShareBoxURL } from './entity.ShareboxURL';
import * as dotenv from 'dotenv';
import { createShareBoxResponse, generateCode, generateExpirationDate, isValidUrl } from './utils';
import { startExpiredLinksCron } from './cron.delete_expired';
import { NextFunction } from 'connect';

dotenv.config();

// Establish database connection
AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
        startExpiredLinksCron();
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
        process.exit(1);
    });

const app = express();
app.use(express.json());

const PORT = process.env.APP_PORT || 3000;



// Create a new user
app.post('/upload', async (req: Request, res: Response) => {
    const { url:bodyUrl } = req.body;
    const { url:queryUrl } = req.query;
    const url = bodyUrl || queryUrl;

    if (!isValidUrl(url)) {
        res.status(400).json({ message: 'Invalid URL' });
        return;
    }

    const shareboxRepository = AppDataSource.getRepository(ShareBoxURL);


    async function _safeStore(url: string, max_retries:number = 3, retry:number = 0) {
        try {
            const code = generateCode()
            const expiresAt = generateExpirationDate(Number(process.env.SHORTLINK_MAX_LIFE_MINS))
            const sharebox = shareboxRepository.create({ url, code, expiresAt });
            return await shareboxRepository.save(sharebox);
        } catch (error) {
            if (retry < max_retries) {
                return _safeStore(url, max_retries, retry + 1);
            }
            res.status(400).json({ message: "Error creating url", error });
        }
    }
    const sharebox = await _safeStore(url)
    if (!sharebox) return;
    res.status(201).json(createShareBoxResponse(sharebox));
});

// Get URL
app.get('/:code', async (req: Request, res: Response) => {
    const { code } = req.params;
    const sharebox = await AppDataSource.getRepository(ShareBoxURL).findOneBy({ code })
    if (sharebox) {
        res.redirect(302, sharebox.url)
        return;
    }
    res.status(404).json({ message: 'URL not found' });
});

app.use((req: Request, res: Response, next: NextFunction) => {
    const start = process.hrtime();

    res.on('finish', () => {
        const diff = process.hrtime(start);
        const durationMs = (diff[0] * 1e9 + diff[1]) / 1e6;

        const logData = {
            timestamp: new Date().toISOString(),
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            ip: req.ip,
            userAgent: req.get('user-agent'),
            duration: `${durationMs.toFixed(3)}ms`,
        };

        setTimeout(() => {
            console.log(logData);
            //Send to event messaging service Ex. RabbitMQ
            // sendEvent(logData)
        }, 0);

    });

    next();
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

