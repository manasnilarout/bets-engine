/**
 * An interface containing the options to be passed
 */
export interface RedisConnectionOpts {
    host?: string;
    port?: number;
    password?: string;
    path?: string;
    socket_keepalive?: boolean;
    enable_offline_queue?: boolean;
}
