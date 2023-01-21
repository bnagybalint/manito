import {
    JsonObject,
    JsonProperty,
    JsonSerializer,
    JsonSerializerOptions,
    throwError,
} from 'typescript-json-serializer'

export const Model = JsonObject;
export const Field = JsonProperty;

export const Serializer = JsonSerializer;
export const SerializerOptions = JsonSerializerOptions;

export const defaultJsonSerializer = new JsonSerializer({
    // Throw errors instead of logging
    errorCallback: throwError,
    // Allow all nullish values
    nullishPolicy: {
        undefined: 'remove',
        null: 'allow'
    },
    // Disallow addiional properties (non JsonProperty)
    additionalPropertiesPolicy: 'disallow',
});
