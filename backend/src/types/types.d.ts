export type DiscordUser = {
    id: string;
    username: string;
    discriminator: string;
    avatar: string | null;
  };
  
  declare global {
    namespace Express {
      interface User extends DiscordUser {}
      interface Request {
        isAuthenticated(): boolean;
        user?: User;
      }
    }
  }