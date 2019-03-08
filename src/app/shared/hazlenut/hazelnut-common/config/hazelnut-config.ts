import { HazelnutConfigInterface } from './hazelnut-config.interface';

let config: HazelnutConfigInterface;
let lastCall = false;

/**
 * Function return new immutable clone of parameter
 *
 * @param data - config file
 * @param lastInit - flag if this is last config initialization
 */
const createConfig = <T extends HazelnutConfigInterface>(data: T, lastInit: boolean): T => {
    if (lastCall) {
        throw new Error('Cannot call function initHazelnutConfig after calling this function with \'lastInit\' flag set on true');
    }
    lastCall = lastInit;

    const proxyHandler: ProxyHandler<any> = {
        get: (obj: any, prop: string) => {
            return obj[prop];
        },
        set: () => {
            throw new Error('Cannot rewrite config property');
        },
    };

    return new Proxy<T>(data, proxyHandler);
};

/**
 * Wrapper around object implements {@HazelnutConfigInterface} and make this object immutable
 */
class ClassAppConfig implements HazelnutConfigInterface {
    public get URL_API(): string {
        return ClassAppConfig._checkConfig().URL_API;
    }

    public get BROWSE_LIMIT(): number {
        return ClassAppConfig._checkConfig().BROWSE_LIMIT;
    }

    public get LANGUAGE(): string {
        return ClassAppConfig._checkConfig().LANGUAGE;
    }

    public get VERSION(): string {
        return ClassAppConfig._checkConfig().VERSION;
    }

    private static _checkConfig(): HazelnutConfigInterface {
        if (!config) {
            throw new Error('App config must be initializes(HazelnutConfig.initHazelnutConfig({...params}))');
        }

        return config;
    }
}

/**
 * Function create and return configuration object
 *
 * @param appConfig - configuration object
 * @param lastInit - flag if this is last call of {@link initHazelnutConfig}
 * @returns - created config object with readonly attributes
 *
 * @example
 * initHazelnutConfig({
 *    URL_API: "/",
 *    LANGUAGE: "sk",
 *    VERSION: "0.0.1",
 *    BROWSE_LIMIT: 10
 * })
 */
export function initHazelnutConfig<T extends HazelnutConfigInterface = HazelnutConfigInterface>(appConfig: T, lastInit = false): T {
    return config = createConfig<T>(appConfig, lastInit);
}

/**
 * immutable instance of {@link ClassAppConfig}
 */
export const HazelnutConfig = new ClassAppConfig();
