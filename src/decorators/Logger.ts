import { Container } from 'typedi';
import * as cls from 'cls-hooked';
import { LoggerOptions } from 'caleido-lib/types';
import { Logger as WinstonLogger } from 'caleido-lib/logger';

export function Logger(scope: string, namespace?: string): ParameterDecorator {

    return (object, propertyKey, index): any => {
        function getRequestID(): string {
            const clsNamespace: cls.Namespace = cls.getNamespace(namespace);
            return clsNamespace.get('requestID');
        }

        const options: LoggerOptions = {};
        if (namespace) {
            options.getRequestID = getRequestID;
        }
        const logger = new WinstonLogger(scope, options);
        const propertyName = propertyKey ? propertyKey.toString() : '';
        Container.registerHandler({ object, propertyName, index, value: () => logger });
    };
}

export { LoggerInterface } from 'caleido-lib/LoggerInterface';
