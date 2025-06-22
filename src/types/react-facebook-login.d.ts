declare module 'react-facebook-login/dist/facebook-login-render-props' {
    import { ComponentType } from 'react';
  
    interface FacebookLoginProps {
      appId: string;
      autoLoad?: boolean;
      fields?: string;
      callback: (response: any) => void;
      render: (renderProps: { onClick: () => void }) => JSX.Element;
    }
  
    const FacebookLogin: ComponentType<FacebookLoginProps>;
    export default FacebookLogin;
  }