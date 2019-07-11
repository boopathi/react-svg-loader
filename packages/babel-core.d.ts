declare module "@babel/core" {
  interface BabelCore {
    types: BabelTypes;
  }

  interface BabelTypes {
    [method: string]: (...args: any[]) => any;
  }

  export default BabelCore;
}
