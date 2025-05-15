// Treat all .js files as modules with 'any' exports
declare module "*.js" {
  const value: any;
  export default value;
}

// Treat all .jsx files as React components with any props
declare module "*.jsx" {
  import * as React from "react";
  const component: React.ComponentType<any>;
  export default component;
}

// Declare redux-persist/integration/react module minimally
declare module "redux-persist/integration/react" {
  import * as React from "react";
  export class PersistGate extends React.Component<any, any> {}
}


declare module './store/store' {
  export const store: any;
  export const persiststore: any;
}
