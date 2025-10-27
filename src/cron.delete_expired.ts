import cron from 'node-cron';
import { AppDataSource } from './connection.DataSource';
import { ShareBoxURL } from './entity.ShareboxURL';
import { LessThan } from 'typeorm';

/**
 * Finds and deletes all expired ShareBoxURL entries from the database.
 */
async function findAndDeleteExpiredLinks() {
    console.log('Running cron job: Deleting expired links...');
    const urlRepository = AppDataSource.getRepository(ShareBoxURL);

    try {
        const now = new Date();
        // Find all links where the expiration date is in the past.
        const expiredLinks = await urlRepository.findBy({
            expiresAt: LessThan(now)
        });

        if (expiredLinks.length > 0) {
            await urlRepository.remove(expiredLinks);
            console.log(`Successfully deleted ${expiredLinks.length} expired link(s).`);
        } else {
            console.log('No expired links found.');
        }
    } catch (error) {
        console.error('Error during expired link deletion:', error);
    }
}

export function startExpiredLinksCron() {
    // Schedule the task to run at the start of every hour.
    cron.schedule('* * * * *', findAndDeleteExpiredLinks);
    console.log('Cron job for deleting expired links has been scheduled.');
}

