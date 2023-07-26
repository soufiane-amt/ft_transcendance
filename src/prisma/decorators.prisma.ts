
export function catchError(): MethodDecorator {
  return (target: Object, key: string | symbol, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await method.apply(this, args);
      } catch (error) {
        // console.error(`Error in ${key.toString()}:`, error);
        throw new Error(`Error in ${key.toString()}: ${error.name}`);
      }
    };

    return descriptor;
  };
}
