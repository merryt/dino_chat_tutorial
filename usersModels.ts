import { Model, DataTypes } from 'https://deno.land/x/denodb/mod.ts';


export class User extends Model {
    static table = 'users'
    static timestamps = true;

    static fields = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        name: DataTypes.string(25),
        email: DataTypes.string(25),
        password: DataTypes.string(25)
    };
}
