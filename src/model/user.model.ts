import { getModelForClass, modelOptions, prop, Severity, pre, DocumentType, index } from "@typegoose/typegoose";
import { nanoid } from "nanoid";
import argon2 from "argon2";
import log from "../utils/logger";

export const privateFields = [
    "password",
    "__v",
    "verificationCode",
    "passwordResetCode",
    "verified",
];

//using a presave hook to hash our password
@pre<User>("save", async function () {
    if (!this.isModified("password")) {
        return;
    }
    // this.password = await bcrypt.hash(this.password, 10);

    const hash = await argon2.hash(this.password);
    this.password = hash;
    return
})

@index({ email: 1 })

//adding default model options
@modelOptions({
    schemaOptions: {
        //adds default createdAt and updatedAt
        timestamps: true,
    },
    options: {
        //
        allowMixed: Severity.ALLOW,
    },
})


export class User {
    @prop({ lowercase: true, required: true, unique: true })
    email: string;

    @prop({ required: true })
    password: string;

    @prop({ required: true, default: () => nanoid() })
    verificationCode: string

    @prop()
    //we set the password reset code back to null so that users cant reset it with the old reset code
    passwordResetCode: string | null

    @prop({ default: false })
    verified: boolean;


    async validatePassword(this: DocumentType<User>, candidatePassword: string) {
        try {
            return await argon2.verify(this.password, candidatePassword);
        } catch (e) {
            log.error(e, "Could not validate password");
            return false
        }

    }
}

const UserModel = getModelForClass(User);
export default UserModel;