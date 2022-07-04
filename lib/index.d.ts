/**
 * @param vp the drawing canvas
 * @param config if provided it will update the default config
 */
export declare const setup: (vp: HTMLCanvasElement, config?: config) => void;
export declare let defaultConfig: config;
export interface config {
    stroke?: {
        width?: number;
        style?: string;
    };
    background?: {
        solid?: {
            color?: string;
        };
        checkered?: {
            colorA?: string;
            colorB?: string;
        };
    };
}
/**
 * change the drawing configuration
 * @param ctx the context which you want to configure
 * @param config the configuration
 */
export declare const setConfig: (ctx: CanvasRenderingContext2D, config: config) => void;
