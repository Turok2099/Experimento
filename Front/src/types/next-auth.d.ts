import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      email: string;
      picture?: string;
    };
    backendJWT?: string;
    userData?: any;
    needsCompletion?: boolean;
  }

  interface JWT {
    user?: {
      name: string;
      email: string;
      picture?: string;
    };
    backendJWT?: string;
    userData?: any;
    needsCompletion?: boolean;
  }
}
