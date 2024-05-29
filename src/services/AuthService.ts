export class AuthService {
    public async getUser(id: string) {
        try {
            return {'id': 1, 'Name':'MediManage'};
        } catch (error) {
            throw new Error('Failed to get user');
        }
    }
}
