
export interface ModelSerializer<ModelType, RawModelType> {
    serialize(obj: ModelType): RawModelType;
    deserialize(data: RawModelType): ModelType;
}