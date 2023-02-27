declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_CONNECT: string;
      MONGO_URI: string;
      USER_TOKEN: string;
      ADMIN_TOKEN: string;
    }
  }
}

export {};
