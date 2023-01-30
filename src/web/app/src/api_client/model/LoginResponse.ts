import { ModelSerializer } from "api_client/ModelSerializer";
import { IUser, UserModel, UserSerializer } from "api_client/model/User";


export interface ILoginResponseModel {
    jwt: string;
    user: IUser;
}

export class LoginResponseModel {
    jwt: string;
    user: UserModel;

    constructor({jwt, user}: ILoginResponseModel) {
        this.jwt = jwt;
        this.user = user;
    }
}

type RawLoginResponseModel = {
    jwt: string;
    user: IUser;
}

export class LoginResponseSerializer implements ModelSerializer<LoginResponseModel, RawLoginResponseModel> {
    serialize(obj: LoginResponseModel): RawLoginResponseModel {
        return {
            jwt: obj.jwt,
            user: new UserSerializer().serialize(obj.user),
        }
    }

    deserialize(data: RawLoginResponseModel): LoginResponseModel {
        const r =  {
            jwt: data.jwt,
            user: new UserSerializer().deserialize(data.user),
        }
        return r;
    }
}
