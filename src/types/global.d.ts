declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: any) => any;
        };
      };
    };
    FB?: {
      login: (callback: (response: any) => void, options: any) => void;
    };
    // AppleID?: {
    //   auth: {
    //     signIn: () => Promise<any>;
    //   };
    // };
  }
}

export {}; 