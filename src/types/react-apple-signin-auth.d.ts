declare module 'react-apple-signin-auth' {
    import { ComponentType } from 'react';
  
    interface AppleSigninProps {
      authOptions: {
        clientId: string;
        scope: string;
        redirectURI: string;
        usePopup: boolean;
      };
      uiType?: string;
      onSuccess: (response: any) => void;
      onError: (error: any) => void;
      render: (renderProps: { onClick: () => void }) => JSX.Element;
    }
  
    const AppleSignin: ComponentType<AppleSigninProps>;
    export default AppleSignin;
  }