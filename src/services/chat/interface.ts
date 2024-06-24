export interface IChatService {
  gpt4(id: string, message: string): Promise<string>;
  clear(id: string): Promise<void>;
}
