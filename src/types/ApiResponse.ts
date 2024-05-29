export interface ApiResponse<T = any> {
    status: 'success' | 'error';
    message?: string;
    data?: T;
    code?: Number;
}
