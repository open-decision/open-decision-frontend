export type cache = {
  ports: { [portCacheName: string]: Element };
  connections: any;
};

export const cache: cache = {
  ports: {},
  connections: {},
};
