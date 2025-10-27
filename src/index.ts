import express, { Request, Response } from 'express';
import { AppDataSource } from './connection.DataSource';
import { ShareBoxURL } from './entity.ShareboxURL';
import * as dotenv from 'dotenv';
import { createShareBoxResponse, generateCode } from './utils';

dotenv.config();

// Establish database connection
AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
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
    const { url } = req.body;
    const shareboxRepository = AppDataSource.getRepository(ShareBoxURL);


    async function _safeStore(url: string, max_retries:number = 3, retry:number = 0) {
        try {
            const code = generateCode()
            const sharebox = shareboxRepository.create({ url, code });
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
    }
    res.status(404).json({ message: 'URL not found' });
    return;
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

