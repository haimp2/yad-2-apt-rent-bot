import logger from '../utils/logger';
import { SubscriptionService } from './SubscriptionService';
import { UserService } from './UserService';
import { Yad2FeedItem } from './yad-2-service/typings';
import { Yad2ApiService } from './yad-2-service/Yad2ApiService';
import { bot } from '../bot/bot';
import { escapeMarkdown } from '../bot/methods/subscription';
import { DateTime } from 'luxon';

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
                // TODOL: Uncomment this line after the demo is done
                // const noneCommercialPosts = this.filterOutCommercialPosts(noneDemoPosts);
                const noneCommercialPosts = noneDemoPosts
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
        const currentDate = DateTime.utc();
        const tenMinutesAgo = currentDate.minus({ minutes: 11 }).toJSDate();
        return posts.filter(post => {
            const date = DateTime.fromFormat(post.date_added, 'yyyy-MM-dd HH:mm:ss').toJSDate();
            return date > tenMinutesAgo
        });
    }

    private createPostMessage(post: Yad2FeedItem) {
        return escapeMarkdown(`
        *🏠 דירה חדשה נמצאה!* ${post.img_url ? `[🖼️](${post.img_url})\n` : ''}
        *🌆 עיר:* ${post.city || 'לא צויין'}
        *📍 שכונה:* ${post.neighborhood || 'לא צויין'}
        *📮 כתובת:* ${post.street || 'לא צויין'}
        *🚪 מספר חדרים:* ${post.Rooms_text || 'לא צויין'}
        *📏 גודל:* ${post.square_meters ? `${post.square_meters} מ״ר` : 'לא צויין'}
        *💰 מחיר:* ${post.price || 'לא צויין'}
        *📅 תאריך פרסום:* ${DateTime.fromFormat(post.date_added, 'yyyy-MM-dd HH:mm:ss').setZone('Asia/Jerusalem').toFormat('dd/MM/yyyy HH:mm')}
        [*🔗 למעבר למודעה*](https://www.yad2.co.il/realestate/item/${post.id})
        `);
    }
}