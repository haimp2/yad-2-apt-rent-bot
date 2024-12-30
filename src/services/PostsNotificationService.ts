import logger from '../utils/logger';
import { SubscriptionService } from './SubscriptionService';
import { UserService } from './UserService';
import { Yad2FeedItem } from './yad-2-service/typings';
import { Yad2ApiService } from './yad-2-service/Yad2ApiService';
import { bot } from '../bot/bot';
import { escapeMarkdown } from '../bot/methods/subscription';

const WORKER_INTERVAL = 1000 * 60 * 10; // 10 minutes

export class PostsNotificationService {
    private UserService: UserService;
    private SubscriptionService: SubscriptionService;
    private Yad2ApiService: Yad2ApiService;

    constructor(UserService: UserService, SubscriptionService: SubscriptionService, Yad2ApiService: Yad2ApiService) {
        this.UserService = UserService;
        this.SubscriptionService = SubscriptionService;
        this.Yad2ApiService = Yad2ApiService;
    }

    public async start(): Promise<void> {
        logger.info('Starting notifications worker');
        await this.startPoolingLoop();
    }

    private async startPoolingLoop() {
        while (true) {
            try {
                await this.sendNotifications();
                await new Promise(resolve => setTimeout(resolve, WORKER_INTERVAL));
            } catch (error) {
                logger.error('Error occurred while sending notifications', error);
            }
        }
    }

    private async sendNotifications() {
        const subscriptions = await this.SubscriptionService.getAllSubscriptions();

        for (const subscription of subscriptions) {
            try {
                const posts = (await this.Yad2ApiService.fetchPosts(subscription))
                const noneDemoPosts = this.filterOutDemoPosts(posts);
                const noneCommercialPosts = this.filterOutCommercialPosts(noneDemoPosts);
                const recentPosts = this.filterNoneRecentPosts(noneCommercialPosts);
                const chatId = (<any>subscription.userId).chatId;

                if (recentPosts.length === 0) {
                    logger.info(`No new posts found for subscription ${subscription._id}`);
                    continue;
                }

                for (const post of recentPosts) {
                    const message = this.createPostMessage(post);
                    logger.info(`Sending notification to user ${subscription.userId._id} for post ${post.id}`);
                    await bot.telegram.sendMessage(chatId, message, { parse_mode: 'MarkdownV2' });
                }

            } catch (error) {
                logger.error(`Error occurred while fetching posts for subscription ${subscription._id}`, error);
            }
        }
    }

    private filterOutDemoPosts(posts: Yad2FeedItem[]) {
        return posts.filter(post => post.id);
    }

    private filterOutCommercialPosts(posts: Yad2FeedItem[]) {
        return posts.filter(post => !post.merchant);
    }

    private filterNoneRecentPosts(posts: Yad2FeedItem[]) {
        // TODOL Check if need to compare with UTC time
        const currentDate = new Date();
        const tenMinutesAgo = new Date(currentDate.getTime() - 10 * 60000);

        return posts.filter(post => new Date(post.date_added) > tenMinutesAgo);
    }

    private createPostMessage(post: Yad2FeedItem) {
        // TODO: add more details to the message - link and photo
        // TODO: change date format
        return escapeMarkdown(`
        *דירה חדשה נמצאה!* ${post.img_url ? `[🏠](${post.img_url})\n` : ''}
        *עיר:* ${post.city}
        *שכונה:* ${post.neighborhood}
        *כתובת:* ${post.street}
        *מספר חדרים:* ${post.Rooms_text}
        *גודל:* ${post.square_meters} מ״ר
        *מחיר:* ${post.price}
        *תאריך פרסום:* ${post.date_added}
        [*למעבר למודעה*](https://www.yad2.co.il/realestate/item/${post.id})
        `);
    }
}