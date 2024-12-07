import User from '../database/models/user';

class UserService {    
    async createUser(chatId: number) {
        User.create({ chatId });
    }
    async getUser(chatId: number) {
        return User.findOne({ chatId });
    }
    async updateUser(chatId: number, data: any) {
        return User.findOneAndUpdate({ chatId }, data, { new: true });
    }
}

export default new UserService();